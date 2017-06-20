/// <reference path="uiTestPlugin.ts"/>
module UITest {

  _module.controller("UI.UITestController2", ["$scope", "$templateCache", ($scope, $templateCache) => {

    $scope.fileUploadExMode = 'text/html';

    $scope.menuItems = [];

    for (var i = 0; i < 10; i++) {
      $scope.menuItems.push("Some Item " + i);
    }

    $scope.contacts = [
      {
        "name": "Anthony Benoit",
        "email": "anthony_benoit@gmail.com",
        "address": "490 E Main Street, Norwich, CT 06360",
      },
      {
        "name": "Chris Fisher",
        "email": "chris_fisher@gmail.com",
        "address": "70 Cliff Avenue, New London, CT 06320"
      },
      {
        "name": "Pamela Rowe",
        "email": "pamela_rowe@gmail.com",
        "address": "50 Water Street, Mystic, CT 06355"
      },
    ];

    $scope.someVal = 1;

    $scope.dropDownConfig = <UI.MenuItem>{
      icon: 'fa fa-cogs',
      title: 'My Awesome Menu',
      items: [{
        title: 'Some Item',
        action: 'someVal=2'
      }, {
        title: 'Some other stuff',
        icon: 'fa fa-twitter',
        action: 'someVal=3'
      }, {
        title: "I've got children",
        icon: 'fa fa-file-text',
        items: [{
          title: 'Hi!',
          action: 'someVal=4'
        }, {
          title: 'Yo!',
          items: [{
            title: 'More!',
            action: 'someVal=5'
          }, {
            title: 'Child',
            action: 'someVal=6'
          }, {
            title: 'Menus!',
            action: 'someVal=7'
          }]
        }]
      }, {
        title: "Call a function!",
        action: () => {
          Core.notification("info", "Function called!");
        }
      }]
    };
    $scope.dropDownConfigTxt = angular.toJson($scope.dropDownConfig, true);

    $scope.$watch('dropDownConfigTxt', (newValue, oldValue) => {
      if (newValue !== oldValue) {
        $scope.dropDownConfig = angular.fromJson($scope.dropDownConfigTxt);
      }
    });

    $scope.dropDownEx = $templateCache.get("dropDownTemplate");
    $scope.autoDropDown1 = $templateCache.get("autoDropDownTemplate1");
    $scope.autoDropDown2 = $templateCache.get("autoDropDownTemplate2");
    $scope.clipboard = $templateCache.get("clipboardTemplate");
    $scope.popoverEx = $templateCache.get("myTemplate");
    $scope.popoverUsageEx = $templateCache.get("popoverExTemplate");
    $scope.autoColumnEx = $templateCache.get("autoColumnTemplate");
  }]);


  _module.controller("UI.UITestController1", ["$scope", "$templateCache", ($scope, $templateCache) => {

    $scope.pagerExampleHtml = $templateCache.get("pagerExample.html");

    $scope.rowIndex = 0;
    $scope.messages = [{
      message: 'one'
    },
    {
      message: 'two'
    },
    {
      message: 'three'
    },
    {
      message: 'four'
    }];
    $scope.selectRow = (index) => {
      $scope.rowIndex = index;
    };
    $scope.getMessage = (index) => {
      return $scope.messages[index];
    }

    $scope.nodes = ["node1", "node2"];
    $scope.otherNodes = ["node4", "node5", "node6"];
    $scope.anchors = ["Top", "Right", "Bottom", "Left"];

    $scope.expandableEx = '' +
      '<div class="expandable closed">\n' +
      '   <div title="The title" class="title">\n' +
      '     <i class="expandable-indicator"></i> Expandable title\n' +
      '   </div>\n' +
      '   <div class="expandable-body well">\n' +
      '     This is the expandable content...  Note that adding the "well" class isn\'t necessary but makes for a nice inset look\n' +
      '   </div>\n' +
      '</div>'


    $scope.editablePropertyEx1 = '<editable-property ng-model="editablePropertyModelEx1" property="property"></editable-property>';

    $scope.editablePropertyModelEx1 = {
      property: "This is editable (hover to edit)"
    };

    $scope.showDeleteOne = new UI.Dialog();
    $scope.showDeleteTwo = new UI.Dialog();

    $scope.fileUploadEx1 = '<div hawtio-file-upload="files" target="test1"></div>';
    $scope.fileUploadEx2 = '<div hawtio-file-upload="files" target="test2" show-files="false"></div>';
    $scope.fileUploadExMode = 'text/html';

    $scope.colorPickerEx = 'My Color ({{myColor}}): <div hawtio-color-picker="myColor"></div>';

    $scope.confirmationEx1 = '' +
      '<button class="btn btn-default" ng-click="showDeleteOne.open()">Delete stuff</button>\n' +
      '\n' +
      '<div hawtio-confirm-dialog="showDeleteOne.show"\n' +
      'title="Delete stuff?"\n' +
      'ok-button-text="Yes, Delete the Stuff"\n' +
      'cancel-button-text="No, Keep the Stuff"\n' +
      'on-cancel="onCancelled(\'One\')"\n' +
      'on-ok="onOk(\'One\')">\n' +
      '  <div class="dialog-body">\n' +
      '    <p>\n' +
      '        Are you sure you want to delete all the stuff?\n' +
      '    </p>\n' +
      '  </div>\n' +
      '</div>\n';

    $scope.sliderEx1 = '' +
      '<button class="btn btn-default" ng-click="showSlideoutRight = !showSlideoutRight">Show slideout right</button>\n' +
      '<div hawtio-slideout="showSlideoutRight" title="Hey look a slider!">\n' +
      '   <div class="dialog-body">\n' +
      '     <div>\n' +
      '       Here is some content or whatever {{transcludedValue}}\n' +
      '     </div>\n' +
      '   </div>\n' +
      '</div>';

    $scope.sliderEx2 = '' +
      '<button class="btn btn-default" ng-click="showSlideoutLeft = !showSlideoutLeft">Show slideout left</button>\n' +
      '<div hawtio-slideout="showSlideoutLeft" direction="left" title="Hey, another slider!">\n' +
      '   <div class="dialog-body">\n' +
      '     <div hawtio-editor="someText" mode="javascript"></div>\n' +
      '   </div>\n' +
      '</div>\n';

    $scope.sliderEx3 = '' +
      '<button class="btn btn-default" ng-click="showSlideoutRight = !showSlideoutRight">Show slideout right no close button</button>\n' +
      '<div hawtio-slideout="showSlideoutRight" close="false" title="Hey look a slider with no close button!">\n' +
      '   <div class="dialog-body">\n' +
      '     <div>\n' +
      '       Here is some content or whatever {{transcludedValue}}\n' +
      '     </div>\n' +
      '   </div>\n' +
      '</div>';

    $scope.editorEx1 = '' +
      'Instance 1\n' +
      '<div class="row-fluid">\n' +
      '   <div hawtio-editor="someText" mode="mode" dirty="dirty"></div>\n' +
      '   <div>Text : {{someText}}</div>\n' +
      '</div>\n' +
      '\n' +
      'Instance 2 (readonly)\n' +
      '<div class="row-fluid">\n' +
      '   <div hawtio-editor="someText" read-only="true" mode="mode" dirty="dirty"></div>\n' +
      '   <div>Text : {{someText}}</div>\n' +
      '</div>';

    $scope.toastNotificationEx1 = "Core.notification('success', 'Saved successfully!');";

    $scope.showToastNotification = () => Core.notification('success', 'Saved successfully!');

    $scope.transcludedValue = "and this is transcluded";

    $scope.onCancelled = (number) => {
      Core.notification('info', 'cancelled ' + number);
    }

    $scope.onOk = (number) => {
      Core.notification('info', number + ' ok!');
    }

    $scope.showSlideoutRight = false;
    $scope.showSlideoutLeft = false;

    $scope.dirty = false;
    $scope.mode = 'javascript';

    $scope.someText = "var someValue = 0;\n" +
      "var someFunc = function() {\n" +
      "  return \"Hello World!\";\n" +
      "}\n";


    $scope.myColor = "#FF887C";
    $scope.showColorDialog = false;

    $scope.files = [];

    $scope.$watch('files', (newValue, oldValue) => {
      if (newValue !== oldValue) {
        console.log("Files: ", $scope.files);
      }
    }, true);
    $scope.GlobalCodeMirrorOptions = CodeEditor.GlobalCodeMirrorOptions;


  }]);

}
