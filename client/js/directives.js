angular
.module('app')
.directive('a', preventClickDirective)
.directive('a', bootstrapCollapseDirective)
.directive('a', navigationDirective)
.directive('button', layoutToggleDirective)
.directive('a', layoutToggleDirective)
.directive('button', collapseMenuTogglerDirective)
.directive('div', bootstrapCarouselDirective)
.directive('toggle', bootstrapTooltipsPopoversDirective)
.directive('tab', bootstrapTabsDirective)
.directive('button', cardCollapseDirective)

.directive('downloadAsExcel', downloadAsExcel)
.directive('printTemplate', printTemplate)
.directive('paging', pagingDirective)
.directive('datepicker', datepickerDirective)
.directive('permission', permissionDirective)
.directive('demoelement', demoelementDirective)
.directive('numbersOnly', numbersOnlyDirective)
.directive('intNum', intNumDirective)
.directive('floatNum', floatNumDirective)
.directive('fileModel', ['$parse', fileModelDirective])
.directive('nextOnEnter', nextOnEnterDirective)
.directive('nextOnChange', nextOnChangeDirective)
.directive('focusMe', setFocusDirective)
.directive('shortcut', shortcutDirective)
.directive('scancode', scancodeDirective)
.directive('convertToNumber', convertToNumberDirective)
.directive('datetime', datetimeDirective)
.directive('stopccp', stopccpDirective)  // disable copy paste
.directive('bhyt', bhytDirective)

function bhytDirective(){
  return {
    restrict: 'E',
    scope: {
      code: '=code'
    },
    templateUrl: 'views/common/bhyt_form.html',
    link: function(scope, el, attrs){
        var code_arr = scope.code.split("-");
        scope.code1 = code_arr[0];
        scope.code2 = code_arr[1];
        scope.code3 = code_arr[2];
        scope.code4 = code_arr[3] + " " + code_arr[4]+ code_arr[5];
    }
}
}
function datetimeDirective(){
  return {
    restrict: 'E',
    scope: {
      datetime: '=datetime'
    },
    templateUrl: 'views/common/datetime.html',
    link: function(scope, el, attrs){
        console.log('datetime',scope.datetime);
    }
  }
}

//Prevent click if href="#"
function preventClickDirective() {
  var directive = {
    restrict: 'E',
    link: link
  }
  return directive;

  function link(scope, element, attrs) {
    if (attrs.href === '#'){
      element.on('click', function(event){
        event.preventDefault();
      });
    }
  }
}

//Bootstrap Collapse
function bootstrapCollapseDirective() {
  var directive = {
    restrict: 'E',
    link: link
  }
  return directive;

  function link(scope, element, attrs) {
    if (attrs.toggle=='collapse'){
      element.attr('href','javascript;;').attr('data-target',attrs.href.replace('index.html',''));
    }
  }
}

/**
* @desc Genesis main navigation - Siedebar menu
* @example <li class="nav-item nav-dropdown"></li>
*/
function navigationDirective() {
  var directive = {
    restrict: 'E',
    link: link
  }
  return directive;

  function link(scope, element, attrs) {
    if(element.hasClass('nav-dropdown-toggle') && angular.element('body').width() > 782) {
      element.on('click', function(){
        if(!angular.element('body').hasClass('compact-nav')) {
          element.parent().toggleClass('open').find('.open').removeClass('open');
        }
      });
    } else if (element.hasClass('nav-dropdown-toggle') && angular.element('body').width() < 783) {
      element.on('click', function(){
        element.parent().toggleClass('open').find('.open').removeClass('open');
      });
    }
  }
}

//Dynamic resize .sidebar-nav
sidebarNavDynamicResizeDirective.$inject = ['$window', '$timeout'];
function sidebarNavDynamicResizeDirective($window, $timeout) {
  var directive = {
    restrict: 'E',
    link: link
  }
  return directive;

  function link(scope, element, attrs) {

    if (element.hasClass('sidebar-nav') && angular.element('body').hasClass('fixed-nav')) {
      var bodyHeight = angular.element(window).height();
      scope.$watch(function(){
        var headerHeight = angular.element('header').outerHeight();

        if (angular.element('body').hasClass('sidebar-off-canvas')) {
          element.css('height', bodyHeight);
        } else {
          element.css('height', bodyHeight - headerHeight);
        }
      })

      angular.element($window).bind('resize', function(){
        var bodyHeight = angular.element(window).height();
        var headerHeight = angular.element('header').outerHeight();
        var sidebarHeaderHeight = angular.element('.sidebar-header').outerHeight();
        var sidebarFooterHeight = angular.element('.sidebar-footer').outerHeight();

        if (angular.element('body').hasClass('sidebar-off-canvas')) {
          element.css('height', bodyHeight - sidebarHeaderHeight - sidebarFooterHeight);
        } else {
          element.css('height', bodyHeight - headerHeight - sidebarHeaderHeight - sidebarFooterHeight);
        }
      });
    }
  }
}

//LayoutToggle
layoutToggleDirective.$inject = ['$interval', '$localStorage'];
function layoutToggleDirective($interval, $localStorage) {
  var directive = {
    restrict: 'E',
    link: link
  }
  return directive;

  function link(scope, element, attrs) {
    element.on('click', function(){
      if (element.hasClass('sidebar-toggler')) {
        //angular.element('body').toggleClass('sidebar-hidden');
        angular.element('body').toggleClass('sidebar-minimized');
        if(angular.element('body').hasClass('sidebar-minimized')){
          //$cookies.put('sidebar-minimized', 'sidebar-minimized');
          $localStorage.sidebar_minimized = 'sidebar-minimized';
        }else{
          //$cookies.remove('sidebar-minimized');
          delete $localStorage.sidebar_minimized;
        }
      }

      if (element.hasClass('aside-menu-toggler')) {
        angular.element('body').toggleClass('aside-menu-hidden');
      }

      if (angular.element('body').hasClass('sidebar-mobile-show') && attrs.$attr.uiSref=='ui-sref') {
        angular.element('body').removeClass('sidebar-mobile-show')
      }
    });
  }
}

//Collapse menu toggler
function collapseMenuTogglerDirective() {
  var directive = {
    restrict: 'E',
    link: link
  }
  return directive;

  function link(scope, element, attrs) {
    element.on('click', function(){
      if (element.hasClass('navbar-toggler') && !element.hasClass('layout-toggler')) {
        angular.element('body').toggleClass('sidebar-mobile-show')
      }
    })
  }
}

//Bootstrap Carousel
function bootstrapCarouselDirective() {
  var directive = {
    restrict: 'E',
    link: link
  }
  return directive;

  function link(scope, element, attrs) {
    if (attrs.ride=='carousel'){
      element.find('a').each(function(){
        //$(this).attr('data-target',$(this).attr('href').replace('index.html','')).attr('href','javascript;;')
        angular.element(this).attr('data-target',angular.element(this).attr('href').replace('index.html','')).attr('href','javascript;;')
      });
    }
  }
}

//Bootstrap Tooltips & Popovers
function bootstrapTooltipsPopoversDirective() {
  var directive = {
    restrict: 'A',
    link: link
  }
  return directive;

  function link(scope, element, attrs) {
    if (attrs.toggle=='tooltip'){
      angular.element(element).tooltip();
    }
    if (attrs.toggle=='popover'){
      angular.element(element).popover();
    }
  }
}

//Bootstrap Tabs
function bootstrapTabsDirective() {
  var directive = {
    restrict: 'A',
    link: link
  }
  return directive;

  function link(scope, element, attrs) {
    element.click(function(e) {
      e.preventDefault();
      angular.element(element).tab('show');
    });
  }
}

//Card Collapse
function cardCollapseDirective() {
  var directive = {
    restrict: 'E',
    link: link
  }
  return directive;

  function link(scope, element, attrs) {
    if (attrs.toggle=='collapse' && element.parent().hasClass('card-actions')){

      if (element.parent().parent().parent().find('.card-block').hasClass('in')) {
        element.find('i').addClass('r180');
      }

      var id = 'collapse-' + Math.floor((Math.random() * 1000000000) + 1);
      element.attr('data-target','#'+id)
      element.parent().parent().parent().find('.card-block').attr('id',id);

      element.on('click', function(){
        element.find('i').toggleClass('r180');
      })
    }
  }
}

/**
 * app directives
 */
function downloadAsExcel($compile, $sce, $templateRequest, $timeout, $rootScope) {
  return {
    restrict: 'E',
    scope: {
      template: '@',
      object: '='
    },
    replace: true,
    template: function(scope, element){
      if(!element.bid) element.bid = 'download-as-excel';
      if(!element.name) element.bname = 'Xuất Excel All';
      return '<a id="'+element.bid+'" ><i class="fa fa-file-excel-o fa-lg"></i> '+element.bname+' </a>'
    },
    link: function(scope, element, attrs) {
      $rootScope.canDownload = false;
      var contentType = 'data:application/vnd.ms-excel;base64';
      var htmlS = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" ><head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8"> <!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{sheetname}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body>{table}</body></html>';
      var format = function(s, c) { return s.replace(/{(\w+)}/g, function(m, p) { return c[p]; }) };

      var blobbed = function(data) {
        var blob = new Blob([format(htmlS, data)], { type: contentType });
        var blobURL = window.URL.createObjectURL(blob);
        if (blobURL) {
          element.attr('href', blobURL);
          element.attr('download', data.name);
        }
      };
      
      scope.$watch('object', function(nv, ov) {
        var tUrl = $sce.getTrustedResourceUrl(scope.template);
        $templateRequest(tUrl)
        .then(function(tmpl) {
          //var t = $('<div/>').append($compile(tmpl)(scope));
          var t = angular.element('<div></div>').append($compile(tmpl)(scope));
          //var w = (scope.object)? scope.object.length:0;
          $timeout(function() {
            scope.$apply();
            blobbed({ 
              sheetname: attrs.sheetname, 
              name: attrs.xlname, 
              table: t.html()
            });
            $rootScope.canDownload = true;
          });
        });
      }, true);
    }
  };
}

function printTemplate($compile, $sce, $templateRequest, $timeout, $rootScope) {
  return {
    restrict: 'E',
    scope: {
      template: '@',
      object: '='
    },
    replace: true,
    template: function(scope, element){
      if(!element.bid) element.bid = 'print_template_1';
      if(!element.name) element.bname = 'Print Template';
      return '<a id="'+element.bid+'" ><i class="fa fa-print fa-lg"></i> '+element.bname+' </a>'
    },
    link: function(scope, element, attrs) {
      var printContents = null;
      $rootScope.canPrint = false;
      function printClk () {
        if(printContents){
          Utils.printContent(printContents);
        }else{
          $timeout(printClk, 500);
        }
      }
      element.on('click', printClk);

      scope.$watch('object', function(nv, ov) {
        printContents = null;
        if(scope.object==undefined || !scope.object) return;
        var tUrl = $sce.getTrustedResourceUrl(scope.template);
        $templateRequest(tUrl).then(function(tmpl) {
          //var t = $('<div/>').append($compile(tmpl)(scope));
          var t = angular.element('<div></div>').append($compile(tmpl)(scope));
          $timeout(function() {
            scope.$apply();
            printContents = t.html();
          }, 10);
        });
      }, true);
    }
  };
}

function pagingDirective() {
  return {
      templateUrl: 'views/common/paging.html'
  };
}

function datepickerDirective() {
  return {
      restrict: 'A',
      require: 'ngModel',
      link: function(scope, element, attrs, ngModel) {
          var useCurrent = attrs.useCurrent;
          var options = {
              format: Configs.formatLongDate
          }
          if(useCurrent==='false'){
              options.useCurrent = false;
          }
          var picker = element.datetimepicker(options);

          //view->model
          picker.on('dp.change', function(e) {
            /*  if (e.target.id == "date_start"){
                  if( scope.dateTo ){
                      $("#"+scope.dateTo).data("DateTimePicker").minDate(e.date);
                  }
              }else if (e.target.id == "date_end"){
                  if(scope.dateFrom){
                      $("#"+scope.dateFrom).data("DateTimePicker").maxDate(e.date);
                  }
              }
*/
              scope.$apply(function(){
                ngModel.$setViewValue(e.date);
              });
          });//*/
          picker.on('focus ', function(e) {
            var p = picker[0], el = element[0]
            if(!p.value || !el.value){
              picker.data("DateTimePicker").clear()
            }
          })
      }
  };
}

function permissionDirective($rootScope, $timeout) {
  return {
    restrict: 'A',
    link: link
  }

  function link(scope, element, attrs) {
    var t = 0;
    //element[0].hidden = true;
    element.hide();
    if ($rootScope.ACL) {
      process();
      //$timeout(process, 0);
    } else {
      $timeout(process, 50);
    }

    function process() {
      if ($rootScope.ACL) {
        var acl = $rootScope.ACL;
        if (acl.user_id && acl.user_id != 1) {
          if(attrs.permission && attrs.permission.indexOf(",")>0){
            var pers = attrs.permission.split(",");
            for(let per of pers){
              per = per.trim();
              if (acl.action_names && (acl.action_names.includes(per) || acl.action_ids.includes(per))) {
                element.show();
                break;
              }
            }
          }else{
            if (acl.action_names && (acl.action_names.includes(attrs.permission) || acl.action_ids.includes(attrs.permission))) {
              element.show();
            } else {
              element.remove();
            }
          }
        } else {
          //element[0].hidden = false;
          element.show();
        }
      } else if (t < 50) {
        t++;
        $timeout(process, 500);
      }
    }
  }
}

function demoelementDirective($rootScope, $timeout) {
  return {
    restrict: 'A',
    link: link
  }

  function link(scope, element, attrs) {
    $timeout(process, 500);
    //element[0].hidden = true;
    element.hide();
    function process (){
      if($rootScope.ACL){
        var acl = $rootScope.ACL;
        if(acl.user_id != 1){
            angular.element(element).remove();
        }else{
          //element[0].hidden = false;
          element.show();
        }
      }else{
        $timeout(process, 500);
      }
    }
  }
}

function numbersOnlyDirective() {
  return {
      restrict: 'A',
      require: 'ngModel',
      link: function (scope, element, attr, ngModelCtrl, filter) {
          function fromUser(text) {
              if (text) {
                  //var transformedInput = text.replace(/[^0-9.,]/g, '');
                  var transformedInput = text.replace(/[^0-9,.]/g, '');

                  if (transformedInput !== text) {
                      ngModelCtrl.$setViewValue(transformedInput);
                      ngModelCtrl.$render();
                  }
                  return transformedInput;
              }
              return undefined;
          }  
          ngModelCtrl.$parsers.push(fromUser);
      }
  };
}
function intNumDirective() {
  return {
    restrict: 'A',
    require: 'ngModel',
      link: function (scope, element, attr, ngModelCtrl, filter) {
          function fromUser(text) {
              if (text) {
                  //var transformedInput = text.replace(/[^0-9.,]/g, '');
                  var transformedInput = text.replace(/[^0-9.]/g, '');
/*
                  if (transformedInput !== text) {
                      ngModelCtrl.$setViewValue(transformedInput);
                      ngModelCtrl.$render();
                  }//*/
                  return transformedInput;
              }
              //return undefined;
              return text;
          }  //*  
          scope.$watch(attr['ngModel'], function (v) {
            v = v + ''
            v = v.replace(/[^0-9.]/g, '');
            ngModelCtrl.$setViewValue(formatNumber(v, 0,'.', ','));
            ngModelCtrl.$render();
          });        //*/
          ngModelCtrl.$parsers.push(fromUser);
      }
  };
}
function floatNumDirective() {
  return {
    restrict: 'A',
    require: 'ngModel',
      link: function (scope, element, attr, ngModelCtrl) {
          function fromUser(text) {
              if (text) {
                  //var transformedInput = text.replace(/[^0-9.,]/g, '');
                  var transformedInput = text.replace(/[^0-9.]/g, '');
/*
                  if (transformedInput !== text) {
                    //ngModelCtrl.$setViewValue(transformedInput);
                      ngModelCtrl.$setViewValue(formatNumber2(transformedInput, 2,'.', ','));
                      ngModelCtrl.$render();
                  }//*/
                  return transformedInput;
              }
              return text;
          }  /*  
          scope.$watch(attr['ngModel'], function (v) {
            var p = attr.floatNum.split(",");
            var n = Number(p[1]);
            v = v + ''
            v = v.replace(/[^0-9.]/g, '');
            ngModelCtrl.$setViewValue(formatNumber(v, n,'.', ','));
            ngModelCtrl.$render();
          });        //*/
          //*
          scope.$watch(attr['ngModel'], function (v) {
            v = v + ''
            v = v.replace(/[^0-9.]/g, '');
            ngModelCtrl.$setViewValue(formatNumber2(v, 2,'.', ','));
            ngModelCtrl.$render();
          });//*/
          ngModelCtrl.$parsers.push(fromUser);
      }
  };
}

function fileModelDirective($parse) {
	return {
	   restrict: 'A',
	   link: function(scope, element, attrs) {
		  var model = $parse(attrs.fileModel);
		  var modelSetter = model.assign;
		  
		  element.bind('change', function(){
			 scope.$apply(function(){
				modelSetter(scope, element[0].files[0]);
			 });
		  });
	   }
	};
 }

function nextOnEnterDirective() {
  return {
    restrict: 'A',
    link: function($scope,selem,attrs) {

      selem.bind('keydown', function (e) {
        var code = e.keyCode || e.which;
        if (code === 13) {
            e.preventDefault();
            var pageElems = document.querySelectorAll('input, select, textarea'),
                elem = e.srcElement || e.target,
                focusNext = false,
                len = pageElems.length;
            for (var i = 0; i < len; i++) {
                var pe = pageElems[i];
                if (focusNext) {
                    if (pe.style.display !== 'none' && !pe.disabled && pe.disabled != 'disabled') {
                        angular.element(pe).focus();
                        break;
                    }
                } else if (pe === elem) {
                    focusNext = true;
                }
            }
        }
      });
    }
  }
}
function nextOnChangeDirective() {
  return {
    restrict: 'A',
    link: function($scope,selem,attrs) {
      //*
      selem.bind('change', function (e) {
        e.preventDefault();
        var pageElems = document.querySelectorAll('input, select, textarea'),
            elem = e.srcElement || e.target,
            focusNext = false,
            len = pageElems.length;
        for (var i = 0; i < len; i++) {
            var pe = pageElems[i];
            if (focusNext) {
                if (pe.style.display !== 'none' && !pe.disabled && pe.disabled != 'disabled') {
                    angular.element(pe).focus();
                    break;
                }
            } else if (pe === elem) {
                focusNext = true;
            }
        }
      });//*/

      selem.bind('keydown', function (e) {
        var code = e.keyCode || e.which;
        if (code === 13) {
          var open = $(this).data("isopen");
          if(!open){
            $(this).data("isopen", !open);
          }else{
            $(this).data("isopen", !open);
            e.preventDefault();
            var pageElems = document.querySelectorAll('input, select, textarea'),
                elem = e.srcElement || e.target,
                focusNext = false,
                len = pageElems.length;
            for (var i = 0; i < len; i++) {
                var pe = pageElems[i];
                if (focusNext) {
                    if (pe.style.display !== 'none' && !pe.disabled && pe.disabled != 'disabled') {
                        angular.element(pe).focus();
                        break;
                    }
                } else if (pe === elem) {
                    focusNext = true;
                }
            }
          }
        }
      });
    }
  }
}

function setFocusDirective() {
  return {
    scope: { trigger: '=focusMe' },
    link: function(scope, element) {
      scope.$watch('trigger', function(value) {
        if(value === true) { 
            element[0].focus();
            scope.trigger = false;
        }
      });
    }
  };
}

function shortcutDirective() {
  return {
    restrict: 'E',
    replace: true,
    scope: true,
    link: function postLink(scope, iElement, iAttrs){
      jQuery(document).off( "keydown" );
      jQuery(document).unbind( "keydown" );
      jQuery(document).on('keydown', function(e){
         scope.$apply(scope.keyDownSave(e)); // too slowly
       });
    }
  };
}
function scancodeDirective() {
  return {
    restrict: 'E',
    replace: true,
    scope: true,
    link: function postLink(scope, iElement, iAttrs){
      jQuery(document).off( "keyup" );
      jQuery(document).unbind( "keyup" );
      jQuery(document).on('keyup', function(e){
         scope.$apply(scope.scanCodeFn(e));  // too slowly
       });
    }
  };
}
function convertToNumberDirective () {
  return {
    require: 'ngModel',
    link: function(scope, element, attrs, ngModel) {
      ngModel.$parsers.push(function(val) {
        return parseInt(val, 10);
      });
      ngModel.$formatters.push(function(val) {
        return '' + val;
      });
    }
  }
}

function stopccpDirective(){
  return {
      scope: {},
      link:function(scope,element){
          element.on('cut copy paste', function (event) {
            event.preventDefault();
          });
      }
  };
}
