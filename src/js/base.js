import { Internal } from './internal';
import { Html } from './html';
import utils from './utils';
import {
  defaultOptions as DEFAULT_OPTIONS,
  defaultItems as DEFAULT_ITEMS
} from './constants';

/**
 * @class Base
 * @extends {ol.control.Control}
 */
export default class Base extends ol.control.Control {
  /**
   * @constructor
   * @param {object|undefined} opt_options Options.
   */
  constructor(opt_options = {}) {
    utils.assert(typeof opt_options == 'object',
      '@param `opt_options` should be object type!'
    );

    // keep old `default_items` compatibility
    if ('default_items' in opt_options) {
      DEFAULT_OPTIONS.defaultItems = opt_options.default_items;
    }
    this.options = utils.mergeOptions(DEFAULT_OPTIONS, opt_options);
    this.disabled = false;

    Base.Internal = new Internal(this);
    Base.Html = new Html(this);

    super({
      element: this.container
    });
  }

  /**
   * Remove all elements from the menu.
   */
  clear() {
    Object.keys(Base.Internal.items).forEach(k => {
      Base.Html.removeMenuEntry(k);
    });
  }

  /**
   * Close the menu programmatically.
   */
  close() {
    Base.Internal.closeMenu();
  }

  /**
   * Enable menu
   */
  enable() {
    this.disabled = false;
  }

  /**
   * Disable menu
   */
  disable() {
    this.disabled = true;
  }

  /**
   * @return {Array} Returns default items
   */
  getDefaultItems() {
    return DEFAULT_ITEMS;
  }

  /**
   * Add items to the menu. This pushes each item in the provided array
   * to the end of the menu.
   * @param {Array} arr Array.
   */
  extend(arr) {
    utils.assert(Array.isArray(arr), '@param `arr` should be an Array.');
    arr.forEach(this.push, this);
  }

  /**
   * Am I opened?.
   */
  isOpened() {
    return Base.Internal.opened;
  }

  /**
   * Remove the last item of the menu.
   */
  pop() {
    const keys = Object.keys(Base.Internal.items);
    Base.Html.removeMenuEntry(keys[keys.length - 1]);
  }

  /**
   * Insert the provided item at the end of the menu.
   * @param {Object|String} item Item.
   */
  push(item) {
    utils.assert(
        utils.isDefAndNotNull(item), '@param `item` must be informed.');
    Base.Html.addMenuEntry(item, Base.Internal.getNextItemIndex());
  }

  /**
   * Remove the first item of the menu.
   */
  shift() {
    Base.Html.removeMenuEntry(Object.keys(Base.Internal.items)[0]);
  }

  /**
   * Not supposed to be used on app.
   */
  setMap(map) {
    ol.control.Control.prototype.setMap.call(this, map);
    if (map) {
      // let's start since now we have the map
      Base.Internal.init(map);
    } else {
      // I'm removed from the map - remove listeners
      Base.Internal.removeListeners();
    }
  }
}
