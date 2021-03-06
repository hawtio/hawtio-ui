/// <reference path="uiTestPlugin.ts"/>
namespace UITest {

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

    $scope.editablePropertyEx1 = '<editable-property ng-model="editablePropertyModelEx1" property="property"></editable-property>';

    $scope.editablePropertyModelEx1 = {
      property: "This is editable (hover to edit)"
    };

    $scope.showDeleteOne = new UI.Dialog();
    $scope.showDeleteTwo = new UI.Dialog();

    $scope.fileUploadEx1 = '<div hawtio-file-upload="files" target="test1"></div>';
    $scope.fileUploadEx2 = '<div hawtio-file-upload="files" target="test2" show-files="false"></div>';
    $scope.fileUploadExMode = 'text/html';

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

    $scope.notificationType = 'success';
    $scope.showToastNotification = () => Core.notification($scope.notificationType, 'Notification message.');

    $scope.transcludedValue = "and this is transcluded";

    $scope.onCancelled = (number) => {
      Core.notification('info', 'cancelled ' + number);
    }

    $scope.onOk = (number) => {
      Core.notification('info', number + ' ok!');
    }

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
