/*!
  * Native JavaScript for Bootstrap v3.0.15 (https://thednp.github.io/bootstrap.native/)
  * Copyright 2015-2021 © dnp_theme
  * Licensed under MIT (https://github.com/thednp/bootstrap.native/blob/master/LICENSE)
  */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.BSN = factory());
}(this, (function () { 'use strict';

  var transitionEndEvent = 'webkitTransition' in document.head.style ? 'webkitTransitionEnd' : 'transitionend';

  var supportTransition = 'webkitTransition' in document.head.style || 'transition' in document.head.style;

  var transitionDuration = 'webkitTransition' in document.head.style ? 'webkitTransitionDuration' : 'transitionDuration';

  var transitionProperty = 'webkitTransition' in document.head.style ? 'webkitTransitionProperty' : 'transitionProperty';

  function getElementTransitionDuration(element) {
    var computedStyle = getComputedStyle(element),
        property = computedStyle[transitionProperty],
        duration = supportTransition && property && property !== 'none'
                 ? parseFloat(computedStyle[transitionDuration]) : 0;
    return !isNaN(duration) ? duration * 1000 : 0;
  }

  function emulateTransitionEnd(element,handler){
    var called = 0, duration = getElementTransitionDuration(element);
    duration ? element.addEventListener( transitionEndEvent, function transitionEndWrapper(e){
                !called && handler(e), called = 1;
                element.removeEventListener( transitionEndEvent, transitionEndWrapper);
              })
             : setTimeout(function() { !called && handler(), called = 1; }, 17);
  }

  function queryElement(selector, parent) {
    var lookUp = parent && parent instanceof Element ? parent : document;
    return selector instanceof Element ? selector : lookUp.querySelector(selector);
  }

  function bootstrapCustomEvent(eventName, componentName, eventProperties) {
    var OriginalCustomEvent = new CustomEvent( eventName + '.bs.' + componentName, {cancelable: true});
    if (typeof eventProperties !== 'undefined') {
      Object.keys(eventProperties).forEach(function (key) {
        Object.defineProperty(OriginalCustomEvent, key, {
          value: eventProperties[key]
        });
      });
    }
    return OriginalCustomEvent;
  }

  function dispatchCustomEvent(customEvent){
    this && this.dispatchEvent(customEvent);
  }

  function Alert(element) {
    var self = this,
      alert,
      closeCustomEvent = bootstrapCustomEvent('close','alert'),
      closedCustomEvent = bootstrapCustomEvent('closed','alert');
    function triggerHandler() {
      alert.classList.contains('fade') ? emulateTransitionEnd(alert,transitionEndHandler) : transitionEndHandler();
    }
    function toggleEvents(action){
      action = action ? 'addEventListener' : 'removeEventListener';
      element[action]('click',clickHandler,false);
    }
    function clickHandler(e) {
      alert = e && e.target.closest(".alert");
      element = queryElement('[data-dismiss="alert"]',alert);
      element && alert && (element === e.target || element.contains(e.target)) && self.close();
    }
    function transitionEndHandler() {
      toggleEvents();
      alert.parentNode.removeChild(alert);
      dispatchCustomEvent.call(alert,closedCustomEvent);
    }
    self.close = function () {
      if ( alert && element && alert.classList.contains('show') ) {
        dispatchCustomEvent.call(alert,closeCustomEvent);
        if ( closeCustomEvent.defaultPrevented ) { return; }
        self.dispose();
        alert.classList.remove('show');
        triggerHandler();
      }
    };
    self.dispose = function () {
      toggleEvents();
      delete element.Alert;
    };
    element = queryElement(element);
    alert = element.closest('.alert');
    element.Alert && element.Alert.dispose();
    if ( !element.Alert ) {
      toggleEvents(1);
    }
    self.element = element;
    element.Alert = self;
  }

  function Button(element) {
    var self = this, labels,
        changeCustomEvent = bootstrapCustomEvent('change', 'button');
    function toggle(e) {
      var input,
          label = e.target.tagName === 'LABEL' ? e.target
                : e.target.closest('LABEL') ? e.target.closest('LABEL') : null;
      input = label && label.getElementsByTagName('INPUT')[0];
      if ( !input ) { return; }
      dispatchCustomEvent.call(input, changeCustomEvent);
      dispatchCustomEvent.call(element, changeCustomEvent);
      if ( input.type === 'checkbox' ) {
        if ( changeCustomEvent.defaultPrevented ) { return; }
        if ( !input.checked ) {
          label.classList.add('active');
          input.getAttribute('checked');
          input.setAttribute('checked','checked');
          input.checked = true;
        } else {
          label.classList.remove('active');
          input.getAttribute('checked');
          input.removeAttribute('checked');
          input.checked = false;
        }
        if (!element.toggled) {
          element.toggled = true;
        }
      }
      if ( input.type === 'radio' && !element.toggled ) {
        if ( changeCustomEvent.defaultPrevented ) { return; }
        if ( !input.checked || (e.screenX === 0 && e.screenY == 0) ) {
          label.classList.add('active');
          label.classList.add('focus');
          input.setAttribute('checked','checked');
          input.checked = true;
          element.toggled = true;
          Array.from(labels).map(function (otherLabel){
            var otherInput = otherLabel.getElementsByTagName('INPUT')[0];
            if ( otherLabel !== label && otherLabel.classList.contains('active') )  {
              dispatchCustomEvent.call(otherInput, changeCustomEvent);
              otherLabel.classList.remove('active');
              otherInput.removeAttribute('checked');
              otherInput.checked = false;
            }
          });
        }
      }
      setTimeout( function () { element.toggled = false; }, 50 );
    }
    function keyHandler(e) {
      var key = e.which || e.keyCode;
      key === 32 && e.target === document.activeElement && toggle(e);
    }
    function preventScroll(e) {
      var key = e.which || e.keyCode;
      key === 32 && e.preventDefault();
    }
    function focusToggle(e) {
      if (e.target.tagName === 'INPUT' ) {
        var action = e.type === 'focusin' ? 'add' : 'remove';
        e.target.closest('.btn').classList[action]('focus');
      }
    }
    function toggleEvents(action) {
      action = action ? 'addEventListener' : 'removeEventListener';
      element[action]('click',toggle,false );
      element[action]('keyup',keyHandler,false), element[action]('keydown',preventScroll,false);
      element[action]('focusin',focusToggle,false), element[action]('focusout',focusToggle,false);
    }
    self.dispose = function () {
      toggleEvents();
      delete element.Button;
    };
    element = queryElement(element);
    element.Button && element.Button.dispose();
    labels = element.getElementsByClassName('btn');
    if (!labels.length) { return; }
    if ( !element.Button ) {
      toggleEvents(1);
    }
    element.toggled = false;
    element.Button = self;
    Array.from(labels).map(function (btn){
      !btn.classList.contains('active')
        && queryElement('input:checked',btn)
        && btn.classList.add('active');
      btn.classList.contains('active')
        && !queryElement('input:checked',btn)
        && btn.classList.remove('active');
    });
  }

  var mouseHoverEvents = ('onmouseleave' in document) ? [ 'mouseenter', 'mouseleave'] : [ 'mouseover', 'mouseout' ];

  var supportPassive = (function () {
    var result = false;
    try {
      var opts = Object.defineProperty({}, 'passive', {
        get: function() {
          result = true;
        }
      });
      document.addEventListener('DOMContentLoaded', function wrap(){
        document.removeEventListener('DOMContentLoaded', wrap, opts);
      }, opts);
    } catch (e) {}
    return result;
  })();

  var passiveHandler = supportPassive ? { passive: true } : false;

  function isElementInScrollRange(element) {
    var bcr = element.getBoundingClientRect(),
        viewportHeight = window.innerHeight || document.documentElement.clientHeight;
    return bcr.top <= viewportHeight && bcr.bottom >= 0;
  }

  function Carousel (element,options) {
    options = options || {};
    var self = this,
      vars, ops,
      slideCustomEvent, slidCustomEvent,
      slides, leftArrow, rightArrow, indicator, indicators;
    function pauseHandler() {
      if ( ops.interval !==false && !element.classList.contains('paused') ) {
        element.classList.add('paused');
        !vars.isSliding && ( clearInterval(vars.timer), vars.timer = null );
      }
    }
    function resumeHandler() {
      if ( ops.interval !== false && element.classList.contains('paused') ) {
        element.classList.remove('paused');
        !vars.isSliding && ( clearInterval(vars.timer), vars.timer = null );
        !vars.isSliding && self.cycle();
      }
    }
    function indicatorHandler(e) {
      e.preventDefault();
      if (vars.isSliding) { return; }
      var eventTarget = e.target;
      if ( eventTarget && !eventTarget.classList.contains('active') && eventTarget.getAttribute('data-slide-to') ) {
        vars.index = parseInt( eventTarget.getAttribute('data-slide-to'));
      } else { return false; }
      self.slideTo( vars.index );
    }
    function controlsHandler(e) {
      e.preventDefault();
      if (vars.isSliding) { return; }
      var eventTarget = e.currentTarget || e.srcElement;
      if ( eventTarget === rightArrow ) {
        vars.index++;
      } else if ( eventTarget === leftArrow ) {
        vars.index--;
      }
      self.slideTo( vars.index );
    }
    function keyHandler(ref) {
      var which = ref.which;
      if (vars.isSliding) { return; }
      switch (which) {
        case 39:
          vars.index++;
          break;
        case 37:
          vars.index--;
          break;
        default: return;
      }
      self.slideTo( vars.index );
    }
    function toggleEvents(action) {
      action = action ? 'addEventListener' : 'removeEventListener';
      if ( ops.pause && ops.interval ) {
        element[action]( mouseHoverEvents[0], pauseHandler, false );
        element[action]( mouseHoverEvents[1], resumeHandler, false );
        element[action]( 'touchstart', pauseHandler, passiveHandler );
        element[action]( 'touchend', resumeHandler, passiveHandler );
      }
      ops.touch && slides.length > 1 && element[action]( 'touchstart', touchDownHandler, passiveHandler );
      rightArrow && rightArrow[action]( 'click', controlsHandler,false );
      leftArrow && leftArrow[action]( 'click', controlsHandler,false );
      indicator && indicator[action]( 'click', indicatorHandler,false );
      ops.keyboard && window[action]( 'keydown', keyHandler,false );
    }
    function toggleTouchEvents(action) {
      action = action ? 'addEventListener' : 'removeEventListener';
      element[action]( 'touchmove', touchMoveHandler, passiveHandler );
      element[action]( 'touchend', touchEndHandler, passiveHandler );
    }
    function touchDownHandler(e) {
      if ( vars.isTouch ) { return; }
      vars.touchPosition.startX = e.changedTouches[0].pageX;
      if ( element.contains(e.target) ) {
        vars.isTouch = true;
        toggleTouchEvents(1);
      }
    }
    function touchMoveHandler(e) {
      if ( !vars.isTouch ) { e.preventDefault(); return; }
      vars.touchPosition.currentX = e.changedTouches[0].pageX;
      if ( e.type === 'touchmove' && e.changedTouches.length > 1 ) {
        e.preventDefault();
        return false;
      }
    }
    function touchEndHandler (e) {
      if ( !vars.isTouch || vars.isSliding ) { return }
      vars.touchPosition.endX = vars.touchPosition.currentX || e.changedTouches[0].pageX;
      if ( vars.isTouch ) {
        if ( (!element.contains(e.target) || !element.contains(e.relatedTarget) )
            && Math.abs(vars.touchPosition.startX - vars.touchPosition.endX) < 75 ) {
          return false;
        } else {
          if ( vars.touchPosition.currentX < vars.touchPosition.startX ) {
            vars.index++;
          } else if ( vars.touchPosition.currentX > vars.touchPosition.startX ) {
            vars.index--;
          }
          vars.isTouch = false;
          self.slideTo(vars.index);
        }
        toggleTouchEvents();
      }
    }
    function setActivePage(pageIndex) {
      Array.from(indicators).map(function (x){x.classList.remove('active');});
      indicators[pageIndex] && indicators[pageIndex].classList.add('active');
    }
    function transitionEndHandler(e){
      if (vars.touchPosition){
        var next = vars.index,
            timeout = e && e.target !== slides[next] ? e.elapsedTime*1000+100 : 20,
            activeItem = self.getActiveIndex(),
            orientation = vars.direction === 'left' ? 'next' : 'prev';
        vars.isSliding && setTimeout(function () {
          if (vars.touchPosition){
            vars.isSliding = false;
            slides[next].classList.add('active');
            slides[activeItem].classList.remove('active');
            slides[next].classList.remove(("carousel-item-" + orientation));
            slides[next].classList.remove(("carousel-item-" + (vars.direction)));
            slides[activeItem].classList.remove(("carousel-item-" + (vars.direction)));
            dispatchCustomEvent.call(element, slidCustomEvent);
            if ( !document.hidden && ops.interval && !element.classList.contains('paused') ) {
              self.cycle();
            }
          }
        }, timeout);
      }
    }
    self.cycle = function () {
      if (vars.timer) {
        clearInterval(vars.timer);
        vars.timer = null;
      }
      vars.timer = setInterval(function () {
        var idx = vars.index || self.getActiveIndex();
        isElementInScrollRange(element) && (idx++, self.slideTo( idx ) );
      }, ops.interval);
    };
    self.slideTo = function (next) {
      if (vars.isSliding) { return; }
      var activeItem = self.getActiveIndex(), orientation, eventProperties;
      if ( activeItem === next ) {
        return;
      } else if  ( (activeItem < next ) || (activeItem === 0 && next === slides.length -1 ) ) {
        vars.direction = 'left';
      } else if  ( (activeItem > next) || (activeItem === slides.length - 1 && next === 0 ) ) {
        vars.direction = 'right';
      }
      if ( next < 0 ) { next = slides.length - 1; }
      else if ( next >= slides.length ){ next = 0; }
      orientation = vars.direction === 'left' ? 'next' : 'prev';
      eventProperties = { relatedTarget: slides[next], direction: vars.direction, from: activeItem, to: next };
      slideCustomEvent = bootstrapCustomEvent('slide', 'carousel', eventProperties);
      slidCustomEvent = bootstrapCustomEvent('slid', 'carousel', eventProperties);
      dispatchCustomEvent.call(element, slideCustomEvent);
      if (slideCustomEvent.defaultPrevented) { return; }
      vars.index = next;
      vars.isSliding = true;
      clearInterval(vars.timer);
      vars.timer = null;
      setActivePage( next );
      if ( getElementTransitionDuration(slides[next]) && element.classList.contains('slide') ) {
        slides[next].classList.add(("carousel-item-" + orientation));
        slides[next].offsetWidth;
        slides[next].classList.add(("carousel-item-" + (vars.direction)));
        slides[activeItem].classList.add(("carousel-item-" + (vars.direction)));
        emulateTransitionEnd(slides[next], transitionEndHandler);
      } else {
        slides[next].classList.add('active');
        slides[next].offsetWidth;
        slides[activeItem].classList.remove('active');
        setTimeout(function () {
          vars.isSliding = false;
          if ( ops.interval && element && !element.classList.contains('paused') ) {
            self.cycle();
          }
          dispatchCustomEvent.call(element, slidCustomEvent);
        }, 100 );
      }
    };
    self.getActiveIndex = function () { return Array.from(slides).indexOf(element.getElementsByClassName('carousel-item active')[0]) || 0; };
    self.dispose = function () {
      var itemClasses = ['left','right','prev','next'];
      Array.from(slides).map(function (slide,idx) {
        slide.classList.contains('active') && setActivePage( idx );
        itemClasses.map(function (cls) { return slide.classList.remove(("carousel-item-" + cls)); });
      });
      clearInterval(vars.timer);
      toggleEvents();
      vars = {};
      ops = {};
      delete element.Carousel;
    };
    element = queryElement( element );
    element.Carousel && element.Carousel.dispose();
    slides = element.getElementsByClassName('carousel-item');
    leftArrow = element.getElementsByClassName('carousel-control-prev')[0];
    rightArrow = element.getElementsByClassName('carousel-control-next')[0];
    indicator = element.getElementsByClassName('carousel-indicators')[0];
    indicators = indicator && indicator.getElementsByTagName( "LI" ) || [];
    if (slides.length < 2) { return }
    var
      intervalAttribute = element.getAttribute('data-interval'),
      intervalData = intervalAttribute === 'false' ? 0 : parseInt(intervalAttribute),
      touchData = element.getAttribute('data-touch') === 'false' ? 0 : 1,
      pauseData = element.getAttribute('data-pause') === 'hover' || false,
      keyboardData = element.getAttribute('data-keyboard') === 'true' || false,
      intervalOption = options.interval,
      touchOption = options.touch;
    ops = {};
    ops.keyboard = options.keyboard === true || keyboardData;
    ops.pause = (options.pause === 'hover' || pauseData) ? 'hover' : false;
    ops.touch = touchOption || touchData;
    ops.interval = typeof intervalOption === 'number' ? intervalOption
                : intervalOption === false || intervalData === 0 || intervalData === false ? 0
                : isNaN(intervalData) ? 5000
                : intervalData;
    if (self.getActiveIndex()<0) {
      slides.length && slides[0].classList.add('active');
      indicators.length && setActivePage(0);
    }
    vars = {};
    vars.direction = 'left';
    vars.index = 0;
    vars.timer = null;
    vars.isSliding = false;
    vars.isTouch = false;
    vars.touchPosition = {
      startX : 0,
      currentX : 0,
      endX : 0
    };
    toggleEvents(1);
    if ( ops.interval ){ self.cycle(); }
    element.Carousel = self;
  }

  function Collapse(element,options) {
    console.log('hakka');
    options = options || {};
    var self = this;
    var accordion = null,
        collapse = null,
        activeCollapse,
        activeElement,
        showCustomEvent,
        shownCustomEvent,
        hideCustomEvent,
        hiddenCustomEvent;
    function openAction(collapseElement, toggle) {
      dispatchCustomEvent.call(collapseElement, showCustomEvent);
      if ( showCustomEvent.defaultPrevented ) { return; }
      collapseElement.isAnimating = true;
      collapseElement.classList.add('collapsing');
      collapseElement.classList.remove('collapse');
      collapseElement.style.height = (collapseElement.scrollHeight) + "px";
      emulateTransitionEnd(collapseElement, function () {
        collapseElement.isAnimating = false;
        collapseElement.setAttribute('aria-expanded','true');
        toggle.setAttribute('aria-expanded','true');
        collapseElement.classList.remove('collapsing');
        collapseElement.classList.add('collapse');
        collapseElement.classList.add('show');
        collapseElement.style.height = '';
        dispatchCustomEvent.call(collapseElement, shownCustomEvent);
      });
    }
    function closeAction(collapseElement, toggle) {
      dispatchCustomEvent.call(collapseElement, hideCustomEvent);
      if ( hideCustomEvent.defaultPrevented ) { return; }
      collapseElement.isAnimating = true;
      collapseElement.style.height = (collapseElement.scrollHeight) + "px";
      collapseElement.classList.remove('collapse');
      collapseElement.classList.remove('show');
      collapseElement.classList.add('collapsing');
      collapseElement.offsetWidth;
      collapseElement.style.height = '0px';
      emulateTransitionEnd(collapseElement, function () {
        collapseElement.isAnimating = false;
        collapseElement.setAttribute('aria-expanded','false');
        toggle.setAttribute('aria-expanded','false');
        collapseElement.classList.remove('collapsing');
        collapseElement.classList.add('collapse');
        collapseElement.style.height = '';
        dispatchCustomEvent.call(collapseElement, hiddenCustomEvent);
      });
    }
    self.toggle = function (e) {
      if (e && e.target.tagName === 'A' || element.tagName === 'A') {e.preventDefault();}
      if (element.contains(e.target) || e.target === element) {
        if (!collapse.classList.contains('show')) { self.show(); }
        else { self.hide(); }
      }
    };
    self.hide = function () {
      if ( collapse.isAnimating ) { return; }
      closeAction(collapse,element);
      element.classList.add('collapsed');
    };
    self.show = function () {
      if ( accordion ) {
        activeCollapse = accordion.getElementsByClassName("collapse show")[0];
        activeElement = activeCollapse && (queryElement(("[data-target=\"#" + (activeCollapse.id) + "\"]"),accordion)
                      || queryElement(("[href=\"#" + (activeCollapse.id) + "\"]"),accordion) );
      }
      if ( !collapse.isAnimating ) {
        if ( activeElement && activeCollapse !== collapse ) {
          closeAction(activeCollapse,activeElement);
          activeElement.classList.add('collapsed');
        }
        openAction(collapse,element);
        element.classList.remove('collapsed');
      }
    };
    self.dispose = function () {
      element.removeEventListener('click',self.toggle,false);
      delete element.Collapse;
    };
      element = queryElement(element);
      element.Collapse && element.Collapse.dispose();
      var accordionData = element.getAttribute('data-parent');
      showCustomEvent = bootstrapCustomEvent('show', 'collapse');
      shownCustomEvent = bootstrapCustomEvent('shown', 'collapse');
      hideCustomEvent = bootstrapCustomEvent('hide', 'collapse');
      hiddenCustomEvent = bootstrapCustomEvent('hidden', 'collapse');
      collapse = queryElement(options.target || element.getAttribute('data-target') || element.getAttribute('href'));
      collapse.isAnimating = false;
      accordion = element.closest(options.parent || accordionData);
      if ( !element.Collapse ) {
        element.addEventListener('click',self.toggle,false);
      }
      element.Collapse = self;
  }

  function setFocus (element){
    element.focus ? element.focus() : element.setActive();
  }

  function Dropdown(element,option) {
    var self = this,
        showCustomEvent,
        shownCustomEvent,
        hideCustomEvent,
        hiddenCustomEvent,
        relatedTarget = null,
        parent, menu, menuItems = [],
        persist;
    function preventEmptyAnchor(anchor) {
      (anchor.href && anchor.href.slice(-1) === '#' || anchor.parentNode && anchor.parentNode.href
        && anchor.parentNode.href.slice(-1) === '#') && this.preventDefault();
    }
    function toggleDismiss() {
      var action = element.open ? 'addEventListener' : 'removeEventListener';
      document[action]('click',dismissHandler,false);
      document[action]('keydown',preventScroll,false);
      document[action]('keyup',keyHandler,false);
      document[action]('focus',dismissHandler,false);
    }
    function dismissHandler(e) {
      var eventTarget = e.target,
            hasData = eventTarget && (eventTarget.getAttribute('data-toggle')
                                  || eventTarget.parentNode && eventTarget.parentNode.getAttribute
                                  && eventTarget.parentNode.getAttribute('data-toggle'));
      if ( e.type === 'focus' && (eventTarget === element || eventTarget === menu || menu.contains(eventTarget) ) ) {
        return;
      }
      if ( (eventTarget === menu || menu.contains(eventTarget)) && (persist || hasData) ) { return; }
      else {
        relatedTarget = eventTarget === element || element.contains(eventTarget) ? element : null;
        self.hide();
      }
      preventEmptyAnchor.call(e,eventTarget);
    }
    function clickHandler(e) {
      relatedTarget = element;
      self.show();
      preventEmptyAnchor.call(e,e.target);
    }
    function preventScroll(e) {
      var key = e.which || e.keyCode;
      if( key === 38 || key === 40 ) { e.preventDefault(); }
    }
    function keyHandler(e) {
      var key = e.which || e.keyCode,
          activeItem = document.activeElement,
          isSameElement = activeItem === element,
          isInsideMenu = menu.contains(activeItem),
          isMenuItem = activeItem.parentNode === menu || activeItem.parentNode.parentNode === menu,
          idx = menuItems.indexOf(activeItem);
      if ( isMenuItem ) {
        idx = isSameElement ? 0
                            : key === 38 ? (idx>1?idx-1:0)
                            : key === 40 ? (idx<menuItems.length-1?idx+1:idx) : idx;
        menuItems[idx] && setFocus(menuItems[idx]);
      }
      if ( (menuItems.length && isMenuItem
            || !menuItems.length && (isInsideMenu || isSameElement)
            || !isInsideMenu )
            && element.open && key === 27
      ) {
        self.toggle();
        relatedTarget = null;
      }
    }
    self.show = function () {
      showCustomEvent = bootstrapCustomEvent('show', 'dropdown', { relatedTarget: relatedTarget });
      dispatchCustomEvent.call(parent, showCustomEvent);
      if ( showCustomEvent.defaultPrevented ) { return; }
      menu.classList.add('show');
      parent.classList.add('show');
      element.setAttribute('aria-expanded',true);
      element.open = true;
      element.removeEventListener('click',clickHandler,false);
      setTimeout(function () {
        setFocus( menu.getElementsByTagName('INPUT')[0] || element );
        toggleDismiss();
        shownCustomEvent = bootstrapCustomEvent('shown', 'dropdown', { relatedTarget: relatedTarget });
        dispatchCustomEvent.call(parent, shownCustomEvent);
      },1);
    };
    self.hide = function () {
      hideCustomEvent = bootstrapCustomEvent('hide', 'dropdown', { relatedTarget: relatedTarget });
      dispatchCustomEvent.call(parent, hideCustomEvent);
      if ( hideCustomEvent.defaultPrevented ) { return; }
      menu.classList.remove('show');
      parent.classList.remove('show');
      element.setAttribute('aria-expanded',false);
      element.open = false;
      toggleDismiss();
      setFocus(element);
      setTimeout(function () {
        element.Dropdown && element.addEventListener('click',clickHandler,false);
      },1);
      hiddenCustomEvent = bootstrapCustomEvent('hidden', 'dropdown', { relatedTarget: relatedTarget });
      dispatchCustomEvent.call(parent, hiddenCustomEvent);
    };
    self.toggle = function () {
      if (parent.classList.contains('show') && element.open) { self.hide(); }
      else { self.show(); }
    };
    self.dispose = function () {
      if (parent.classList.contains('show') && element.open) { self.hide(); }
      element.removeEventListener('click',clickHandler,false);
      delete element.Dropdown;
    };
    element = queryElement(element);
    element.Dropdown && element.Dropdown.dispose();
    parent = element.parentNode;
    menu = queryElement('.dropdown-menu', parent);
    Array.from(menu.children).map(function (child){
      child.children.length && (child.children[0].tagName === 'A' && menuItems.push(child.children[0]));
      child.tagName === 'A' && menuItems.push(child);
    });
    if ( !element.Dropdown ) {
      !('tabindex' in menu) && menu.setAttribute('tabindex', '0');
      element.addEventListener('click',clickHandler,false);
    }
    persist = option === true || element.getAttribute('data-persist') === 'true' || false;
    element.open = false;
    element.Dropdown = self;
  }

  function Modal(element,options) {
    options = options || {};
    var self = this, modal,
      showCustomEvent,
      shownCustomEvent,
      hideCustomEvent,
      hiddenCustomEvent,
      relatedTarget = null,
      scrollBarWidth,
      overlay,
      overlayDelay,
      fixedItems,
      ops = {};
    function setScrollbar() {
      var openModal = document.body.classList.contains('modal-open'),
          bodyPad = parseInt(getComputedStyle(document.body).paddingRight),
          bodyOverflow = document.documentElement.clientHeight !== document.documentElement.scrollHeight
                      || document.body.clientHeight !== document.body.scrollHeight,
          modalOverflow = modal.clientHeight !== modal.scrollHeight;
      scrollBarWidth = measureScrollbar();
      modal.style.paddingRight = !modalOverflow && scrollBarWidth ? (scrollBarWidth + "px") : '';
      document.body.style.paddingRight = modalOverflow || bodyOverflow ? ((bodyPad + (openModal ? 0:scrollBarWidth)) + "px") : '';
      fixedItems.length && fixedItems.map(function (fixed){
        var itemPad = getComputedStyle(fixed).paddingRight;
        fixed.style.paddingRight = modalOverflow || bodyOverflow ? ((parseInt(itemPad) + (openModal?0:scrollBarWidth)) + "px") : ((parseInt(itemPad)) + "px");
      });
    }
    function resetScrollbar() {
      document.body.style.paddingRight = '';
      modal.style.paddingRight = '';
      fixedItems.length && fixedItems.map(function (fixed){
        fixed.style.paddingRight = '';
      });
    }
    function measureScrollbar() {
      var scrollDiv = document.createElement('div'), widthValue;
      scrollDiv.className = 'modal-scrollbar-measure';
      document.body.appendChild(scrollDiv);
      widthValue = scrollDiv.offsetWidth - scrollDiv.clientWidth;
      document.body.removeChild(scrollDiv);
      return widthValue;
    }
    function createOverlay() {
      var newOverlay = document.createElement('div');
      overlay = queryElement('.modal-backdrop');
      if ( overlay === null ) {
        newOverlay.setAttribute('class', 'modal-backdrop' + (ops.animation ? ' fade' : ''));
        overlay = newOverlay;
        document.body.appendChild(overlay);
      }
      return overlay;
    }
    function removeOverlay () {
      overlay = queryElement('.modal-backdrop');
      if ( overlay && !document.getElementsByClassName('modal show')[0] ) {
        document.body.removeChild(overlay); overlay = null;
      }
      overlay === null && (document.body.classList.remove('modal-open'), resetScrollbar());
    }
    function toggleEvents(action) {
      action = action ? 'addEventListener' : 'removeEventListener';
      window[action]( 'resize', self.update, passiveHandler);
      modal[action]( 'click',dismissHandler,false);
      document[action]( 'keydown',keyHandler,false);
    }
    function beforeShow() {
      modal.style.display = 'block';
      setScrollbar();
      !document.getElementsByClassName('modal show')[0] && document.body.classList.add('modal-open');
      modal.classList.add('show');
      modal.setAttribute('aria-hidden', false);
      modal.classList.contains('fade') ? emulateTransitionEnd(modal, triggerShow) : triggerShow();
    }
    function triggerShow() {
      setFocus(modal);
      modal.isAnimating = false;
      toggleEvents(1);
      shownCustomEvent = bootstrapCustomEvent('shown', 'modal', { relatedTarget: relatedTarget });
      dispatchCustomEvent.call(modal, shownCustomEvent);
    }
    function triggerHide(force) {
      modal.style.display = '';
      element && (setFocus(element));
      overlay = queryElement('.modal-backdrop');
      if (force !== 1 && overlay && overlay.classList.contains('show') && !document.getElementsByClassName('modal show')[0]) {
        overlay.classList.remove('show');
        emulateTransitionEnd(overlay,removeOverlay);
      } else {
        removeOverlay();
      }
      toggleEvents();
      modal.isAnimating = false;
      hiddenCustomEvent = bootstrapCustomEvent('hidden', 'modal');
      dispatchCustomEvent.call(modal, hiddenCustomEvent);
    }
    function clickHandler(e) {
      if ( modal.isAnimating ) { return; }
      var clickTarget = e.target,
          modalID = "#" + (modal.getAttribute('id')),
          targetAttrValue = clickTarget.getAttribute('data-target') || clickTarget.getAttribute('href'),
          elemAttrValue = element.getAttribute('data-target') || element.getAttribute('href');
      if ( !modal.classList.contains('show')
          && (clickTarget === element && targetAttrValue === modalID
          || element.contains(clickTarget) && elemAttrValue === modalID) ) {
        modal.modalTrigger = element;
        relatedTarget = element;
        self.show();
        e.preventDefault();
      }
    }
    function keyHandler(ref) {
      var which = ref.which;
      if (!modal.isAnimating && ops.keyboard && which == 27 && modal.classList.contains('show') ) {
        self.hide();
      }
    }
    function dismissHandler(e) {
      if ( modal.isAnimating ) { return; }
      var clickTarget = e.target,
          hasData = clickTarget.getAttribute('data-dismiss') === 'modal',
          parentWithData = clickTarget.closest('[data-dismiss="modal"]');
      if ( modal.classList.contains('show') && ( parentWithData || hasData
          || clickTarget === modal && ops.backdrop !== 'static' ) ) {
        self.hide(); relatedTarget = null;
        e.preventDefault();
      }
    }
    self.toggle = function () {
      if ( modal.classList.contains('show') ) {self.hide();} else {self.show();}
    };
    self.show = function () {
      if (modal.classList.contains('show') && !!modal.isAnimating ) {return}
      showCustomEvent = bootstrapCustomEvent('show', 'modal', { relatedTarget: relatedTarget });
      dispatchCustomEvent.call(modal, showCustomEvent);
      if ( showCustomEvent.defaultPrevented ) { return; }
      modal.isAnimating = true;
      var currentOpen = document.getElementsByClassName('modal show')[0];
      if (currentOpen && currentOpen !== modal) {
        currentOpen.modalTrigger && currentOpen.modalTrigger.Modal.hide();
        currentOpen.Modal && currentOpen.Modal.hide();
      }
      if ( ops.backdrop ) {
        overlay = createOverlay();
      }
      if ( overlay && !currentOpen && !overlay.classList.contains('show') ) {
        overlay.offsetWidth;
        overlayDelay = getElementTransitionDuration(overlay);
        overlay.classList.add('show');
      }
      !currentOpen ? setTimeout( beforeShow, overlay && overlayDelay ? overlayDelay:0 ) : beforeShow();
    };
    self.hide = function (force) {
      if ( !modal.classList.contains('show') ) {return}
      hideCustomEvent = bootstrapCustomEvent( 'hide', 'modal');
      dispatchCustomEvent.call(modal, hideCustomEvent);
      if ( hideCustomEvent.defaultPrevented ) { return; }
      modal.isAnimating = true;
      modal.classList.remove('show');
      modal.setAttribute('aria-hidden', true);
      modal.classList.contains('fade') && force !== 1 ? emulateTransitionEnd(modal, triggerHide) : triggerHide();
    };
    self.setContent = function (content) {
      queryElement('.modal-content',modal).innerHTML = content;
    };
    self.update = function () {
      if (modal.classList.contains('show')) {
        setScrollbar();
      }
    };
    self.dispose = function () {
      self.hide(1);
      if (element) {element.removeEventListener('click',clickHandler,false); delete element.Modal; }
      else {delete modal.Modal;}
    };
    element = queryElement(element);
    var checkModal = queryElement( element.getAttribute('data-target') || element.getAttribute('href') );
    modal = element.classList.contains('modal') ? element : checkModal;
    fixedItems = Array.from(document.getElementsByClassName('fixed-top'))
                      .concat(Array.from(document.getElementsByClassName('fixed-bottom')));
    if ( element.classList.contains('modal') ) { element = null; }
    element && element.Modal && element.Modal.dispose();
    modal && modal.Modal && modal.Modal.dispose();
    ops.keyboard = options.keyboard === false || modal.getAttribute('data-keyboard') === 'false' ? false : true;
    ops.backdrop = options.backdrop === 'static' || modal.getAttribute('data-backdrop') === 'static' ? 'static' : true;
    ops.backdrop = options.backdrop === false || modal.getAttribute('data-backdrop') === 'false' ? false : ops.backdrop;
    ops.animation = modal.classList.contains('fade') ? true : false;
    ops.content = options.content;
    modal.isAnimating = false;
    if ( element && !element.Modal ) {
      element.addEventListener('click',clickHandler,false);
    }
    if ( ops.content ) {
      self.setContent( ops.content.trim() );
    }
    if (element) {
      modal.modalTrigger = element;
      element.Modal = self;
    } else {
      modal.Modal = self;
    }
  }

  var mouseClickEvents = { down: 'mousedown', up: 'mouseup' };

  function getScroll() {
    return {
      y : window.pageYOffset || document.documentElement.scrollTop,
      x : window.pageXOffset || document.documentElement.scrollLeft
    }
  }

  function styleTip(link,element,position,parent) {
    var tipPositions = /\b(top|bottom|left|right)+/,
        elementDimensions = { w : element.offsetWidth, h: element.offsetHeight },
        windowWidth = (document.documentElement.clientWidth || document.body.clientWidth),
        windowHeight = (document.documentElement.clientHeight || document.body.clientHeight),
        rect = link.getBoundingClientRect(),
        scroll = parent === document.body ? getScroll() : { x: parent.offsetLeft + parent.scrollLeft, y: parent.offsetTop + parent.scrollTop },
        linkDimensions = { w: rect.right - rect.left, h: rect.bottom - rect.top },
        isPopover = element.classList.contains('popover'),
        arrow = element.getElementsByClassName('arrow')[0],
        halfTopExceed = rect.top + linkDimensions.h/2 - elementDimensions.h/2 < 0,
        halfLeftExceed = rect.left + linkDimensions.w/2 - elementDimensions.w/2 < 0,
        halfRightExceed = rect.left + elementDimensions.w/2 + linkDimensions.w/2 >= windowWidth,
        halfBottomExceed = rect.top + elementDimensions.h/2 + linkDimensions.h/2 >= windowHeight,
        topExceed = rect.top - elementDimensions.h < 0,
        leftExceed = rect.left - elementDimensions.w < 0,
        bottomExceed = rect.top + elementDimensions.h + linkDimensions.h >= windowHeight,
        rightExceed = rect.left + elementDimensions.w + linkDimensions.w >= windowWidth;
    position = (position === 'left' || position === 'right') && leftExceed && rightExceed ? 'top' : position;
    position = position === 'top' && topExceed ? 'bottom' : position;
    position = position === 'bottom' && bottomExceed ? 'top' : position;
    position = position === 'left' && leftExceed ? 'right' : position;
    position = position === 'right' && rightExceed ? 'left' : position;
    var topPosition,
      leftPosition,
      arrowTop,
      arrowLeft,
      arrowWidth,
      arrowHeight;
    element.className.indexOf(position) === -1 && (element.className = element.className.replace(tipPositions,position));
    arrowWidth = arrow.offsetWidth; arrowHeight = arrow.offsetHeight;
    if ( position === 'left' || position === 'right' ) {
      if ( position === 'left' ) {
        leftPosition = rect.left + scroll.x - elementDimensions.w - ( isPopover ? arrowWidth : 0 );
      } else {
        leftPosition = rect.left + scroll.x + linkDimensions.w;
      }
      if (halfTopExceed) {
        topPosition = rect.top + scroll.y;
        arrowTop = linkDimensions.h/2 - arrowWidth;
      } else if (halfBottomExceed) {
        topPosition = rect.top + scroll.y - elementDimensions.h + linkDimensions.h;
        arrowTop = elementDimensions.h - linkDimensions.h/2 - arrowWidth;
      } else {
        topPosition = rect.top + scroll.y - elementDimensions.h/2 + linkDimensions.h/2;
        arrowTop = elementDimensions.h/2 - (isPopover ? arrowHeight*0.9 : arrowHeight/2);
      }
    } else if ( position === 'top' || position === 'bottom' ) {
      if ( position === 'top') {
        topPosition =  rect.top + scroll.y - elementDimensions.h - ( isPopover ? arrowHeight : 0 );
      } else {
        topPosition = rect.top + scroll.y + linkDimensions.h;
      }
      if (halfLeftExceed) {
        leftPosition = 0;
        arrowLeft = rect.left + linkDimensions.w/2 - arrowWidth;
      } else if (halfRightExceed) {
        leftPosition = windowWidth - elementDimensions.w*1.01;
        arrowLeft = elementDimensions.w - ( windowWidth - rect.left ) + linkDimensions.w/2 - arrowWidth/2;
      } else {
        leftPosition = rect.left + scroll.x - elementDimensions.w/2 + linkDimensions.w/2;
        arrowLeft = elementDimensions.w/2 - ( isPopover ? arrowWidth : arrowWidth/2 );
      }
    }
    element.style.top = topPosition + 'px';
    element.style.left = leftPosition + 'px';
    arrowTop && (arrow.style.top = arrowTop + 'px');
    arrowLeft && (arrow.style.left = arrowLeft + 'px');
  }

  function Popover(element,options) {
    options = options || {};
    var self = this;
    var popover = null,
        timer = 0,
        isIphone = /(iPhone|iPod|iPad)/.test(navigator.userAgent),
        titleString,
        contentString,
        ops = {};
    var triggerData,
        animationData,
        placementData,
        dismissibleData,
        delayData,
        containerData,
        closeBtn,
        showCustomEvent,
        shownCustomEvent,
        hideCustomEvent,
        hiddenCustomEvent,
        containerElement,
        containerDataElement,
        modal,
        navbarFixedTop,
        navbarFixedBottom,
        placementClass;
    function dismissibleHandler(e) {
      if (popover !== null && e.target === queryElement('.close',popover)) {
        self.hide();
      }
    }
    function getContents() {
      return {
        0 : options.title || element.getAttribute('data-title') || null,
        1 : options.content || element.getAttribute('data-content') || null
      }
    }
    function removePopover() {
      ops.container.removeChild(popover);
      timer = null; popover = null;
    }
    function createPopover() {
      titleString = getContents()[0] || null;
      contentString = getContents()[1];
      contentString = !!contentString ? contentString.trim() : null;
      popover = document.createElement('div');
      var popoverArrow = document.createElement('div');
      popoverArrow.classList.add('arrow');
      popover.appendChild(popoverArrow);
      if ( contentString !== null && ops.template === null ) {
        popover.setAttribute('role','tooltip');
        if (titleString !== null) {
          var popoverTitle = document.createElement('h3');
          popoverTitle.classList.add('popover-header');
          popoverTitle.innerHTML = ops.dismissible ? titleString + closeBtn : titleString;
          popover.appendChild(popoverTitle);
        }
        var popoverBodyMarkup = document.createElement('div');
        popoverBodyMarkup.classList.add('popover-body');
        popoverBodyMarkup.innerHTML = ops.dismissible && titleString === null ? contentString + closeBtn : contentString;
        popover.appendChild(popoverBodyMarkup);
      } else {
        var popoverTemplate = document.createElement('div');
        popoverTemplate.innerHTML = ops.template.trim();
        popover.className = popoverTemplate.firstChild.className;
        popover.innerHTML = popoverTemplate.firstChild.innerHTML;
        var popoverHeader = queryElement('.popover-header',popover),
            popoverBody = queryElement('.popover-body',popover);
        titleString && popoverHeader && (popoverHeader.innerHTML = titleString.trim());
        contentString && popoverBody && (popoverBody.innerHTML = contentString.trim());
      }
      ops.container.appendChild(popover);
      popover.style.display = 'block';
      !popover.classList.contains( 'popover') && popover.classList.add('popover');
      !popover.classList.contains( ops.animation) && popover.classList.add(ops.animation);
      !popover.classList.contains( placementClass) && popover.classList.add(placementClass);
    }
    function showPopover() {
      !popover.classList.contains('show') && ( popover.classList.add('show') );
    }
    function updatePopover() {
      styleTip(element, popover, ops.placement, ops.container);
    }
    function forceFocus () {
      if (popover === null) { element.focus(); }
    }
    function toggleEvents(action) {
      action = action ? 'addEventListener' : 'removeEventListener';
      if (ops.trigger === 'hover') {
        element[action]( mouseClickEvents.down, self.show );
        element[action]( mouseHoverEvents[0], self.show );
        if (!ops.dismissible) { element[action]( mouseHoverEvents[1], self.hide ); }
      } else if ('click' == ops.trigger) {
        element[action]( ops.trigger, self.toggle );
      } else if ('focus' == ops.trigger) {
        isIphone && element[action]( 'click', forceFocus, false );
        element[action]( ops.trigger, self.toggle );
      }
    }
    function touchHandler(e){
      if ( popover && popover.contains(e.target) || e.target === element || element.contains(e.target)) ; else {
        self.hide();
      }
    }
    function dismissHandlerToggle(action) {
      action = action ? 'addEventListener' : 'removeEventListener';
      if (ops.dismissible) {
        document[action]('click', dismissibleHandler, false );
      } else {
        'focus' == ops.trigger && element[action]( 'blur', self.hide );
        'hover' == ops.trigger && document[action]( 'touchstart', touchHandler, passiveHandler );
      }
      window[action]('resize', self.hide, passiveHandler );
    }
    function showTrigger() {
      dismissHandlerToggle(1);
      dispatchCustomEvent.call(element, shownCustomEvent);
    }
    function hideTrigger() {
      dismissHandlerToggle();
      removePopover();
      dispatchCustomEvent.call(element, hiddenCustomEvent);
    }
    self.toggle = function () {
      if (popover === null) { self.show(); }
      else { self.hide(); }
    };
    self.show = function () {
      clearTimeout(timer);
      timer = setTimeout( function () {
        if (popover === null) {
          dispatchCustomEvent.call(element, showCustomEvent);
          if ( showCustomEvent.defaultPrevented ) { return; }
          createPopover();
          updatePopover();
          showPopover();
          !!ops.animation ? emulateTransitionEnd(popover, showTrigger) : showTrigger();
        }
      }, 20 );
    };
    self.hide = function () {
      clearTimeout(timer);
      timer = setTimeout( function () {
        if (popover && popover !== null && popover.classList.contains('show')) {
          dispatchCustomEvent.call(element, hideCustomEvent);
          if ( hideCustomEvent.defaultPrevented ) { return; }
          popover.classList.remove('show');
          !!ops.animation ? emulateTransitionEnd(popover, hideTrigger) : hideTrigger();
        }
      }, ops.delay );
    };
    self.dispose = function () {
      self.hide();
      toggleEvents();
      delete element.Popover;
    };
    element = queryElement(element);
    element.Popover && element.Popover.dispose();
    triggerData = element.getAttribute('data-trigger');
    animationData = element.getAttribute('data-animation');
    placementData = element.getAttribute('data-placement');
    dismissibleData = element.getAttribute('data-dismissible');
    delayData = element.getAttribute('data-delay');
    containerData = element.getAttribute('data-container');
    closeBtn = '<button type="button" class="close">×</button>';
    showCustomEvent = bootstrapCustomEvent('show', 'popover');
    shownCustomEvent = bootstrapCustomEvent('shown', 'popover');
    hideCustomEvent = bootstrapCustomEvent('hide', 'popover');
    hiddenCustomEvent = bootstrapCustomEvent('hidden', 'popover');
    containerElement = queryElement(options.container);
    containerDataElement = queryElement(containerData);
    modal = element.closest('.modal');
    navbarFixedTop = element.closest('.fixed-top');
    navbarFixedBottom = element.closest('.fixed-bottom');
    ops.template = options.template ? options.template : null;
    ops.trigger = options.trigger ? options.trigger : triggerData || 'hover';
    ops.animation = options.animation && options.animation !== 'fade' ? options.animation : animationData || 'fade';
    ops.placement = options.placement ? options.placement : placementData || 'top';
    ops.delay = parseInt(options.delay || delayData) || 200;
    ops.dismissible = options.dismissible || dismissibleData === 'true' ? true : false;
    ops.container = containerElement ? containerElement
                            : containerDataElement ? containerDataElement
                            : navbarFixedTop ? navbarFixedTop
                            : navbarFixedBottom ? navbarFixedBottom
                            : modal ? modal : document.body;
    placementClass = "bs-popover-" + (ops.placement);
    var popoverContents = getContents();
    titleString = popoverContents[0];
    contentString = popoverContents[1];
    if ( !contentString && !ops.template ) { return; }
    if ( !element.Popover ) {
      toggleEvents(1);
    }
    element.Popover = self;
  }

  function ScrollSpy(element,options) {
    options = options || {};
    var self = this,
      vars,
      targetData,
      offsetData,
      spyTarget,
      scrollTarget,
      ops = {};
    function updateTargets(){
      var links = spyTarget.getElementsByTagName('A');
      if (vars.length !== links.length) {
        vars.items = [];
        vars.targets = [];
        Array.from(links).map(function (link){
          var href = link.getAttribute('href'),
            targetItem = href && href.charAt(0) === '#' && href.slice(-1) !== '#' && queryElement(href);
          if ( targetItem ) {
            vars.items.push(link);
            vars.targets.push(targetItem);
          }
        });
        vars.length = links.length;
      }
    }
    function updateItem(index) {
      var item = vars.items[index],
        targetItem = vars.targets[index],
        dropmenu = item.classList.contains('dropdown-item') && item.closest('.dropdown-menu'),
        dropLink = dropmenu && dropmenu.previousElementSibling,
        nextSibling = item.nextElementSibling,
        activeSibling = nextSibling && nextSibling.getElementsByClassName('active').length,
        targetRect = vars.isWindow && targetItem.getBoundingClientRect(),
        isActive = item.classList.contains('active') || false,
        topEdge = (vars.isWindow ? targetRect.top + vars.scrollOffset : targetItem.offsetTop) - ops.offset,
        bottomEdge = vars.isWindow ? targetRect.bottom + vars.scrollOffset - ops.offset
                   : vars.targets[index+1] ? vars.targets[index+1].offsetTop - ops.offset
                   : element.scrollHeight,
        inside = activeSibling || vars.scrollOffset >= topEdge && bottomEdge > vars.scrollOffset;
       if ( !isActive && inside ) {
        item.classList.add('active');
        if (dropLink && !dropLink.classList.contains('active') ) {
          dropLink.classList.add('active');
        }
        dispatchCustomEvent.call(element, bootstrapCustomEvent( 'activate', 'scrollspy', { relatedTarget: vars.items[index] }));
      } else if ( isActive && !inside ) {
        item.classList.remove('active');
        if (dropLink && dropLink.classList.contains('active') && !item.parentNode.getElementsByClassName('active').length ) {
          dropLink.classList.remove('active');
        }
      } else if ( isActive && inside || !inside && !isActive ) {
        return;
      }
    }
    function updateItems() {
      updateTargets();
      vars.scrollOffset = vars.isWindow ? getScroll().y : element.scrollTop;
      vars.items.map(function (l,idx){ return updateItem(idx); });
    }
    function toggleEvents(action) {
      action = action ? 'addEventListener' : 'removeEventListener';
      scrollTarget[action]('scroll', self.refresh, passiveHandler );
      window[action]( 'resize', self.refresh, passiveHandler );
    }
    self.refresh = function () {
      updateItems();
    };
    self.dispose = function () {
      toggleEvents();
      delete element.ScrollSpy;
    };
    element = queryElement(element);
    element.ScrollSpy && element.ScrollSpy.dispose();
    targetData = element.getAttribute('data-target');
    offsetData = element.getAttribute('data-offset');
    spyTarget = queryElement(options.target || targetData);
    scrollTarget = element.offsetHeight < element.scrollHeight ? element : window;
    if (!spyTarget) { return }
    ops.target = spyTarget;
    ops.offset = parseInt(options.offset || offsetData) || 10;
    vars = {};
    vars.length = 0;
    vars.items = [];
    vars.targets = [];
    vars.isWindow = scrollTarget === window;
    if ( !element.ScrollSpy ) {
      toggleEvents(1);
    }
    self.refresh();
    element.ScrollSpy = self;
  }

  function Tab(element,options) {
    options = options || {};
    var self = this,
      heightData,
      tabs, dropdown,
      showCustomEvent,
      shownCustomEvent,
      hideCustomEvent,
      hiddenCustomEvent,
      next,
      tabsContentContainer = false,
      activeTab,
      activeContent,
      nextContent,
      containerHeight,
      equalContents,
      nextHeight,
      animateHeight;
    function triggerEnd() {
      tabsContentContainer.style.height = '';
      tabsContentContainer.classList.remove('collapsing');
      tabs.isAnimating = false;
    }
    function triggerShow() {
      if (tabsContentContainer) {
        if ( equalContents ) {
          triggerEnd();
        } else {
          setTimeout(function () {
            tabsContentContainer.style.height = nextHeight + "px";
            tabsContentContainer.offsetWidth;
            emulateTransitionEnd(tabsContentContainer, triggerEnd);
          },50);
        }
      } else {
        tabs.isAnimating = false;
      }
      shownCustomEvent = bootstrapCustomEvent('shown', 'tab', { relatedTarget: activeTab });
      dispatchCustomEvent.call(next, shownCustomEvent);
    }
    function triggerHide() {
      if (tabsContentContainer) {
        activeContent.style.float = 'left';
        nextContent.style.float = 'left';
        containerHeight = activeContent.scrollHeight;
      }
      showCustomEvent = bootstrapCustomEvent('show', 'tab', { relatedTarget: activeTab });
      hiddenCustomEvent = bootstrapCustomEvent('hidden', 'tab', { relatedTarget: next });
      dispatchCustomEvent.call(next, showCustomEvent);
      if ( showCustomEvent.defaultPrevented ) { return; }
      nextContent.classList.add('active');
      activeContent.classList.remove('active');
      if (tabsContentContainer) {
        nextHeight = nextContent.scrollHeight;
        equalContents = nextHeight === containerHeight;
        tabsContentContainer.classList.add('collapsing');
        tabsContentContainer.style.height = containerHeight + "px";
        tabsContentContainer.offsetHeight;
        activeContent.style.float = '';
        nextContent.style.float = '';
      }
      if ( nextContent.classList.contains('fade') ) {
        setTimeout(function () {
          nextContent.classList.add('show');
          emulateTransitionEnd(nextContent,triggerShow);
        },20);
      } else { triggerShow(); }
      dispatchCustomEvent.call(activeTab, hiddenCustomEvent);
    }
    function getActiveTab() {
      var activeTabs = tabs.getElementsByClassName('active'), activeTab;
      if ( activeTabs.length === 1 && !activeTabs[0].parentNode.classList.contains('dropdown') ) {
        activeTab = activeTabs[0];
      } else if ( activeTabs.length > 1 ) {
        activeTab = activeTabs[activeTabs.length-1];
      }
      return activeTab;
    }
    function getActiveContent() { return queryElement(getActiveTab().getAttribute('href')) }
    function clickHandler(e) {
      e.preventDefault();
      next = e.currentTarget;
      !tabs.isAnimating && self.show();
    }
    self.show = function () {
      next = next || element;
      if (!next.classList.contains('active')) {
        nextContent = queryElement(next.getAttribute('href'));
        activeTab = getActiveTab();
        activeContent = getActiveContent();
        hideCustomEvent = bootstrapCustomEvent( 'hide', 'tab', { relatedTarget: next });
        dispatchCustomEvent.call(activeTab, hideCustomEvent);
        if (hideCustomEvent.defaultPrevented) { return; }
        tabs.isAnimating = true;
        activeTab.classList.remove('active');
        activeTab.setAttribute('aria-selected','false');
        next.classList.add('active');
        next.setAttribute('aria-selected','true');
        if ( dropdown ) {
          if ( !element.parentNode.classList.contains('dropdown-menu') ) {
            if (dropdown.classList.contains('active')) { dropdown.classList.remove('active'); }
          } else {
            if (!dropdown.classList.contains('active')) { dropdown.classList.add('active'); }
          }
        }
        if (activeContent.classList.contains('fade')) {
          activeContent.classList.remove('show');
          emulateTransitionEnd(activeContent, triggerHide);
        } else { triggerHide(); }
      }
    };
    self.dispose = function () {
      element.removeEventListener('click',clickHandler,false);
      delete element.Tab;
    };
    element = queryElement(element);
    element.Tab && element.Tab.dispose();
    heightData = element.getAttribute('data-height');
    tabs = element.closest('.nav');
    dropdown = tabs && queryElement('.dropdown-toggle',tabs);
    animateHeight = !supportTransition || (options.height === false || heightData === 'false') ? false : true;
    tabs.isAnimating = false;
    if ( !element.Tab ) {
      element.addEventListener('click',clickHandler,false);
    }
    if (animateHeight) { tabsContentContainer = getActiveContent().parentNode; }
    element.Tab = self;
  }

  function Toast(element,options) {
    options = options || {};
    var self = this,
        toast, timer = 0,
        animationData,
        autohideData,
        delayData,
        showCustomEvent,
        hideCustomEvent,
        shownCustomEvent,
        hiddenCustomEvent,
        ops = {};
    function showComplete() {
      toast.classList.remove( 'showing' );
      toast.classList.add( 'show' );
      dispatchCustomEvent.call(toast,shownCustomEvent);
      if (ops.autohide) { self.hide(); }
    }
    function hideComplete() {
      toast.classList.add( 'hide' );
      dispatchCustomEvent.call(toast,hiddenCustomEvent);
    }
    function close () {
      toast.classList.remove('show' );
      ops.animation ? emulateTransitionEnd(toast, hideComplete) : hideComplete();
    }
    function disposeComplete() {
      clearTimeout(timer);
      element.removeEventListener('click',self.hide,false);
      delete element.Toast;
    }
    self.show = function () {
      if (toast && !toast.classList.contains('show')) {
        dispatchCustomEvent.call(toast,showCustomEvent);
        if (showCustomEvent.defaultPrevented) { return; }
        ops.animation && toast.classList.add( 'fade' );
        toast.classList.remove('hide' );
        toast.offsetWidth;
        toast.classList.add('showing' );
        ops.animation ? emulateTransitionEnd(toast, showComplete) : showComplete();
      }
    };
    self.hide = function (noTimer) {
      if (toast && toast.classList.contains('show')) {
        dispatchCustomEvent.call(toast,hideCustomEvent);
        if(hideCustomEvent.defaultPrevented) { return; }
        noTimer ? close() : (timer = setTimeout( close, ops.delay));
      }
    };
    self.dispose = function () {
      ops.animation ? emulateTransitionEnd(toast, disposeComplete) : disposeComplete();
    };
    element = queryElement(element);
    element.Toast && element.Toast.dispose();
    toast = element.closest('.toast');
    animationData = element.getAttribute('data-animation');
    autohideData = element.getAttribute('data-autohide');
    delayData = element.getAttribute('data-delay');
    showCustomEvent = bootstrapCustomEvent('show', 'toast');
    hideCustomEvent = bootstrapCustomEvent('hide', 'toast');
    shownCustomEvent = bootstrapCustomEvent('shown', 'toast');
    hiddenCustomEvent = bootstrapCustomEvent('hidden', 'toast');
    ops.animation = options.animation === false || animationData === 'false' ? 0 : 1;
    ops.autohide = options.autohide === false || autohideData === 'false' ? 0 : 1;
    ops.delay = parseInt(options.delay || delayData) || 500;
    if ( !element.Toast ) {
      element.addEventListener('click',self.hide,false);
    }
    element.Toast = self;
  }

  function Tooltip(element,options) {
    options = options || {};
    var self = this,
        tooltip = null, timer = 0, titleString,
        animationData,
        placementData,
        delayData,
        containerData,
        showCustomEvent,
        shownCustomEvent,
        hideCustomEvent,
        hiddenCustomEvent,
        containerElement,
        containerDataElement,
        modal,
        navbarFixedTop,
        navbarFixedBottom,
        placementClass,
        ops = {};
    function getTitle() {
      return element.getAttribute('title')
          || element.getAttribute('data-title')
          || element.getAttribute('data-original-title')
    }
    function removeToolTip() {
      ops.container.removeChild(tooltip);
      tooltip = null; timer = null;
    }
    function createToolTip() {
      titleString = getTitle();
      if ( titleString ) {
        tooltip = document.createElement('div');
        if (ops.template) {
          var tooltipMarkup = document.createElement('div');
          tooltipMarkup.innerHTML = ops.template.trim();
          tooltip.className = tooltipMarkup.firstChild.className;
          tooltip.innerHTML = tooltipMarkup.firstChild.innerHTML;
          queryElement('.tooltip-inner',tooltip).innerHTML = titleString.trim();
        } else {
          var tooltipArrow = document.createElement('div');
          tooltipArrow.classList.add('arrow');
          tooltip.appendChild(tooltipArrow);
          var tooltipInner = document.createElement('div');
          tooltipInner.classList.add('tooltip-inner');
          tooltip.appendChild(tooltipInner);
          tooltipInner.innerHTML = titleString;
        }
        tooltip.style.left = '0';
        tooltip.style.top = '0';
        tooltip.setAttribute('role','tooltip');
        !tooltip.classList.contains('tooltip') && tooltip.classList.add('tooltip');
        !tooltip.classList.contains(ops.animation) && tooltip.classList.add(ops.animation);
        !tooltip.classList.contains(placementClass) && tooltip.classList.add(placementClass);
        ops.container.appendChild(tooltip);
      }
    }
    function updateTooltip() {
      styleTip(element, tooltip, ops.placement, ops.container);
    }
    function showTooltip() {
      !tooltip.classList.contains('show') && ( tooltip.classList.add('show') );
    }
    function touchHandler(e){
      if ( tooltip && tooltip.contains(e.target) || e.target === element || element.contains(e.target)) ; else {
        self.hide();
      }
    }
    function toggleAction(action){
      action = action ? 'addEventListener' : 'removeEventListener';
      document[action]( 'touchstart', touchHandler, passiveHandler );
      window[action]( 'resize', self.hide, passiveHandler );
    }
    function showAction() {
      toggleAction(1);
      dispatchCustomEvent.call(element, shownCustomEvent);
    }
    function hideAction() {
      toggleAction();
      removeToolTip();
      dispatchCustomEvent.call(element, hiddenCustomEvent);
    }
    function toggleEvents(action) {
      action = action ? 'addEventListener' : 'removeEventListener';
      element[action](mouseClickEvents.down, self.show,false);
      element[action](mouseHoverEvents[0], self.show,false);
      element[action](mouseHoverEvents[1], self.hide,false);
    }
    self.show = function () {
      clearTimeout(timer);
      timer = setTimeout( function () {
        if (tooltip === null) {
          dispatchCustomEvent.call(element, showCustomEvent);
          if (showCustomEvent.defaultPrevented) { return; }
          if(createToolTip() !== false) {
            updateTooltip();
            showTooltip();
            !!ops.animation ? emulateTransitionEnd(tooltip, showAction) : showAction();
          }
        }
      }, 20 );
    };
    self.hide = function () {
      clearTimeout(timer);
      timer = setTimeout( function () {
        if (tooltip && tooltip.classList.contains('show')) {
          dispatchCustomEvent.call(element, hideCustomEvent);
          if (hideCustomEvent.defaultPrevented) { return; }
          tooltip.classList.remove('show');
          !!ops.animation ? emulateTransitionEnd(tooltip, hideAction) : hideAction();
        }
      }, ops.delay);
    };
    self.toggle = function () {
      if (!tooltip) { self.show(); }
      else { self.hide(); }
    };
    self.dispose = function () {
      toggleEvents();
      self.hide();
      element.setAttribute('title', element.getAttribute('data-original-title'));
      element.removeAttribute('data-original-title');
      delete element.Tooltip;
    };
    element = queryElement(element);
    element.Tooltip && element.Tooltip.dispose();
    animationData = element.getAttribute('data-animation');
    placementData = element.getAttribute('data-placement');
    delayData = element.getAttribute('data-delay');
    containerData = element.getAttribute('data-container');
    showCustomEvent = bootstrapCustomEvent('show', 'tooltip');
    shownCustomEvent = bootstrapCustomEvent('shown', 'tooltip');
    hideCustomEvent = bootstrapCustomEvent('hide', 'tooltip');
    hiddenCustomEvent = bootstrapCustomEvent('hidden', 'tooltip');
    containerElement = queryElement(options.container);
    containerDataElement = queryElement(containerData);
    modal = element.closest('.modal');
    navbarFixedTop = element.closest('.fixed-top');
    navbarFixedBottom = element.closest('.fixed-bottom');
    ops.animation = options.animation && options.animation !== 'fade' ? options.animation : animationData || 'fade';
    ops.placement = options.placement ? options.placement : placementData || 'top';
    ops.template = options.template ? options.template : null;
    ops.delay = parseInt(options.delay || delayData) || 200;
    ops.container = containerElement ? containerElement
                            : containerDataElement ? containerDataElement
                            : navbarFixedTop ? navbarFixedTop
                            : navbarFixedBottom ? navbarFixedBottom
                            : modal ? modal : document.body;
    placementClass = "bs-tooltip-" + (ops.placement);
    titleString = getTitle();
    if ( !titleString ) { return; }
    if (!element.Tooltip) {
      element.setAttribute('data-original-title',titleString);
      element.removeAttribute('title');
      toggleEvents(1);
    }
    element.Tooltip = self;
  }

  var componentsInit = {};

  function initializeDataAPI( Constructor, collection ){
    Array.from(collection).map(function (x){ return new Constructor(x); });
  }
  function initCallback(lookUp){
    console.log('hakka2');
    lookUp = lookUp || document;
    console.log('hakka3')
    console.log(lookUp)
    for (var component in componentsInit) {
      console.log(component)
      initializeDataAPI( componentsInit[component][0], lookUp.querySelectorAll (componentsInit[component][1]) );
    }
  }

  componentsInit.Alert = [ Alert, '[data-dismiss="alert"]'];
  componentsInit.Button = [ Button, '[data-toggle="buttons"]' ];
  componentsInit.Carousel = [ Carousel, '[data-ride="carousel"]' ];
  componentsInit.Collapse = [ Collapse, '[data-toggle="collapse"]' ];
  componentsInit.Dropdown = [ Dropdown, '[data-toggle="dropdown"]'];
  componentsInit.Modal = [ Modal, '[data-toggle="modal"]' ];
  componentsInit.Popover = [ Popover, '[data-toggle="popover"],[data-tip="popover"]' ];
  componentsInit.ScrollSpy = [ ScrollSpy, '[data-spy="scroll"]' ];
  componentsInit.Tab = [ Tab, '[data-toggle="tab"]' ];
  componentsInit.Toast = [ Toast, '[data-dismiss="toast"]' ];
  componentsInit.Tooltip = [ Tooltip, '[data-toggle="tooltip"],[data-tip="tooltip"]' ];
  document.body ? initCallback() : document.addEventListener( 'DOMContentLoaded', function initWrapper(){
  	initCallback();
  	document.removeEventListener('DOMContentLoaded',initWrapper,false);
  }, false );

  function removeElementDataAPI( ConstructorName, collection ){
    Array.from(collection).map(function (x){ return x[ConstructorName].dispose(); });
  }
  function removeDataAPI(lookUp) {
    lookUp = lookUp || document;
    for (var component in componentsInit) {
      removeElementDataAPI( component, lookUp.querySelectorAll (componentsInit[component][1]) );
    }
  }

  var version = "3.0.15";

  var index = {
    Alert: Alert,
    Button: Button,
    Carousel: Carousel,
    Collapse: Collapse,
    Dropdown: Dropdown,
    Modal: Modal,
    Popover: Popover,
    ScrollSpy: ScrollSpy,
    Tab: Tab,
    Toast: Toast,
    Tooltip: Tooltip,
    initCallback: initCallback,
    removeDataAPI: removeDataAPI,
    componentsInit: componentsInit,
    Version: version
  };

  return index;

})));
