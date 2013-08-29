angular.module('ui.bootstrap.collapse',['ui.bootstrap.transition'])

// The collapsible directive indicates a block of html that will expand and collapse
.directive('collapse', ['$transition', function($transition) {
  // CSS transitions don't work with height: auto, so we have to manually change the height to a
  // specific value and then once the animation completes, we can reset the height to auto.
  // Unfortunately if you do this while the CSS transitions are specified (i.e. in the CSS class
  // "collapse") then you trigger a change to height 0 in between.
  // The fix is to remove the "collapse" CSS class while changing the height back to auto - phew!

  // NOTE:
  // Removed the fixUpHeight function, for now, as more class manipulation was needed than before.

  return {
    link: function(scope, element, attrs) {

      var isCollapsed;
      var initialAnimSkip = true;
      scope.$watch(function (){ return element[0].scrollHeight; }, function (value) {
        //The listener is called when scollHeight changes
        //It actually does on 2 scenarios: 
        // 1. Parent is set to display none
        // 2. angular bindings inside are resolved
        //When we have a change of scrollHeight we are setting again the correct height if the group is opened
        if (element[0].scrollHeight !== 0) {
          if (!isCollapsed) {
            if (initialAnimSkip) {
              element.css({height: element[0].scrollHeight + 'px'});
              element.removeClass('collapse in collapsing');
              var x = element[0].offsetWidth;
              element.addClass('collapse in');
            } else {
              element.css({height: 'auto'});
              element.removeClass('collapse in collapsing');
              var x = element[0].offsetWidth;
              element.addClass('collapse in');
            }
          }
        }
      });
      
      scope.$watch(attrs.collapse, function(value) {
        if (value) {
          collapse();
        } else {
          expand();
        }
      });
      

      var currentTransition;
      var doTransition = function(change) {
        if ( currentTransition ) {
          currentTransition.cancel();
        }
        currentTransition = $transition(element,change);
        currentTransition.then(
          function() { currentTransition = undefined;},
          function() { currentTransition = undefined;}
        );
        return currentTransition;
      };

      var expand = function() {
        if (initialAnimSkip) {
          initialAnimSkip = false;
          if ( !isCollapsed ) {
            element.removeClass('collapsing');
            var x = element[0].offsetWidth;
            element.addClass('collapse in');
            element.css({height: 'auto'});
          }
        } else {
          doTransition({ height : element[0].scrollHeight + 'px' })
          .then(function() {
            // This check ensures that we don't accidentally update the height if the user has closed
            // the group while the animation was still running
            if ( !isCollapsed ) {
              // Switch to post-transition display: block
              element.removeClass('collapsing in');
              var x = element[0].offsetWidth;
              element.addClass('collapse in');
              element.css({height: 'auto'});
            }
            // Promise testing purposes only
            // console.log("Fired expand promise");
          });
        }
        isCollapsed = false;
      };
      
      var collapse = function() {
        isCollapsed = true;
        if (initialAnimSkip) {
          initialAnimSkip = false;
          element.removeClass('collapsing in');
          var x = element[0].offsetWidth;
          element.addClass('collapse');

        } else {
          // Switch to collapsing for the transition
          element.removeClass('collapse in');
          var x = element[0].offsetWidth;
          element.addClass('collapsing');
          
          doTransition({'height':'0px'})
              .then(function() {
                // After the transition, remove collapsing and add collapse
                if (isCollapsed) {
                    element.removeClass('collapsing');
                    element.addClass('collapse');
                }
                console.log("Fired collapse promise");
              });
        }
      };
    }
  };
}]);
