// @inheritedComponent Popover

import * as React from 'react';
import PropTypes from 'prop-types';
import * as ReactDOM from 'react-dom';
import getScrollbarSize from 'dom-helpers/util/scrollbarSize';
import withStyles from '../styles/withStyles';
import Popover from '../Popover';
import MenuList from './MenuList';

const RTL_ORIGIN = {
  vertical: 'top',
  horizontal: 'right',
};

const LTR_ORIGIN = {
  vertical: 'top',
  horizontal: 'left',
};

export const MenuStyles = {
  paper: {
    // specZ: The maximum height of a simple menu should be one or more rows less than the view
    // height. This ensures a tappable area outside of the simple menu with which to dismiss
    // the menu.
    maxHeight: 'calc(100vh - 96px)',
    // Add iOS momentum scrolling.
    WebkitOverflowScrolling: 'touch',
  },
};

class Menu extends React.Component {
  componentDidMount() {
    if (this.props.open) {
      this.focus();
    }
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.open && this.props.open) {
      // Needs to refocus as when a menu is rendered into another Modal,
      // the first modal might change the focus to prevent any leak.
      this.focus();
    }
  }

  getContentAnchorEl = () => {
    if (!this.menuList || !this.menuList.selectedItem) {
      return ReactDOM.findDOMNode(this.menuList).firstChild;
    }

    return ReactDOM.findDOMNode(this.menuList.selectedItem);
  };

  menuList = undefined;

  focus = () => {
    if (this.menuList && this.menuList.selectedItem) {
      ReactDOM.findDOMNode(this.menuList.selectedItem).focus();
      return;
    }

    const menuList = ReactDOM.findDOMNode(this.menuList);
    if (menuList && menuList.firstChild) {
      menuList.firstChild.focus();
    }
  };

  handleEnter = element => {
    const { theme } = this.props;

    const menuList = ReactDOM.findDOMNode(this.menuList);

    // Focus so the scroll computation of the Popover works as expected.
    this.focus();

    // Let's ignore that piece of logic if users are already overriding the width
    // of the menu.

    if (menuList && element.clientHeight < menuList.clientHeight && !menuList.style.width) {
      const size = `${getScrollbarSize()}px`;

      menuList.style[theme.direction === 'rtl' ? 'paddingLeft' : 'paddingRight'] = size;

      menuList.style.width = `calc(100% + ${size})`;
    }

    if (this.props.onEnter) {
      this.props.onEnter(element);
    }
  };

  handleListKeyDown = (event, key) => {
    if (key === 'tab') {
      event.preventDefault();

      if (this.props.onClose) {
        this.props.onClose(event);
      }
    }
  };

  render() {
    const {
      children,
      classes,
      MenuListProps,
      onEnter,
      open, // https://github.com/facebook/flow/issues/5253
      PaperProps = {},
      PopoverClasses,
      theme,
      ...other
    } = this.props;

    const themeDirection = theme && theme.direction;
    return (
      <Popover
        getContentAnchorEl={this.getContentAnchorEl}
        classes={PopoverClasses}
        onEnter={this.handleEnter}
        open={open}
        anchorOrigin={themeDirection === 'rtl' ? RTL_ORIGIN : LTR_ORIGIN}
        transformOrigin={themeDirection === 'rtl' ? RTL_ORIGIN : LTR_ORIGIN}
        PaperProps={{
          ...PaperProps,
          classes: {
            ...PaperProps.classes,
            root: classes.paper,
          },
        }}
        {...other}
      >
        <MenuList
          data-mui-test="Menu"
          role="menu"
          onKeyDown={this.handleListKeyDown}
          {...MenuListProps}
          ref={node => {
            this.menuList = node;
          }}
        >
          {children}
        </MenuList>
      </Popover>
    );
  }
}

Menu.propTypes = {
  /**
   * The DOM element used to set the position of the menu.
   */
  anchorEl: PropTypes.object,
  /**
   * Menu contents, normally `MenuItem`s.
   */
  children: PropTypes.node,
  /**
   * Useful to extend the style applied to components.
   */
  classes: PropTypes.object.isRequired,
  /**
   * Properties applied to the `MenuList` element.
   */
  MenuListProps: PropTypes.object,
  /**
   * Callback fired when the component requests to be closed.
   *
   * @param {object} event The event source of the callback
   */
  onClose: PropTypes.func,
  /**
   * Callback fired before the Menu enters.
   */
  onEnter: PropTypes.func,
  /**
   * Callback fired when the Menu has entered.
   */
  onEntered: PropTypes.func,
  /**
   * Callback fired when the Menu is entering.
   */
  onEntering: PropTypes.func,
  /**
   * Callback fired before the Menu exits.
   */
  onExit: PropTypes.func,
  /**
   * Callback fired when the Menu has exited.
   */
  onExited: PropTypes.func,
  /**
   * Callback fired when the Menu is exiting.
   */
  onExiting: PropTypes.func,
  /**
   * If `true`, the menu is visible.
   */
  open: PropTypes.bool,
  /**
   * @ignore
   */
  PaperProps: PropTypes.object,
  /**
   * `classes` property applied to the `Popover` element.
   */
  PopoverClasses: PropTypes.object,
  /**
   * @ignore
   */
  theme: PropTypes.object.isRequired,
  /**
   * The length of the transition in `ms`, or 'auto'
   */
  transitionDuration: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.shape({ enter: PropTypes.number, exit: PropTypes.number }),
    PropTypes.oneOf(['auto']),
  ]),
};

Menu.defaultProps = {
  open: false,
  transitionDuration: 'auto',
};

export default withStyles(MenuStyles, { withTheme: true, name: 'MuiMenu' })(Menu);
