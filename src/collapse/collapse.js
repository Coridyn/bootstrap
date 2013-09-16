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
                    //The listener is called when scrollHeight changes
                    //It actually does on 2 scenarios:
                    // 1. Parent is set to display none
                    // 2. angular bindings inside are resolved
                    //When we have a change of scrollHeight we are setting again the correct height if the group is opened
                    var x = null;
                    if (element[0].scrollHeight !== 0) {
                        if (!isCollapsed) {
                            if (initialAnimSkip) {
                                element.css({height: 'auto'});
                                element.removeClass('collapse in collapsing');
                                x = element[0].offsetWidth;
                                element.addClass('collapse in');
                            } else {
                                element.css({height: element[0].scrollHeight + 'px'});
                                element.removeClass('collapse in collapsing');
                                x = element[0].offsetWidth;
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
                    ).then(
                        function() { animationComplete(); }
                    );
                };

                var animationComplete = function() {
                    element.removeClass('collapsing');
                    var x = element[0].offsetWidth;

                    if (isCollapsed) {
                        element.addClass('collapse');
                        console.log('Animation Complete isCollapsed Fired');
                    }
                    else {
                        element.addClass('collapse in');
                        element.css({height: 'auto'});
                        console.log('Animation Complete Not isCollapsed Fired');
                    }
                };

                var expand = function() {
                    if (initialAnimSkip) {
                        initialAnimSkip = false;
                        animationComplete();
                    } else {
                        // Switch to collapsing for the transition
                        element.removeClass('collapse in');
                        var x = element[0].offsetWidth;
                        element.addClass('collapsing');

                        doTransition({ height : element[0].scrollHeight + 'px' });
                    }
                    isCollapsed = false;
                };

                var collapse = function() {
                    isCollapsed = true;
                    if (initialAnimSkip) {
                        initialAnimSkip = false;
                        animationComplete();
                    } else {
                        // Switch to collapsing for the transition
                        element.removeClass('collapse in');
                        var x = element[0].offsetWidth;
                        element.addClass('collapsing');

                        var scrollHeight = element[0].scrollHeight + 'px';
                        console.log('Height: ' + element[0].style.cssText);
                        element.css({height: scrollHeight});
                        console.log('Height: ' + element[0].style.cssText);
                        doTransition({'height':'0px'});
                    }
                };
            }
        };
    }]);
