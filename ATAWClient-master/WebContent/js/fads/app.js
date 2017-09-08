//var serviceurl =  "http://localhost:8080/ATAW";
var serviceurl =  "/ATAW";
//var leftmenu = serviceurl+"Client";
var leftmenu = "http://localhost:8080/erp";
var respText = '';
var app = angular.module("erpinstance", ['ngRoute', 'ngResource', 'mb-scrollbar', 'ngDialog', 'ui.sortable', 'angularUtils.directives.dirPagination', 'ngCookies', 'chart.js', '720kb.datepicker', 'ngAnimate', 'anguFixedHeaderTable', 'scrollable-table'])
  .config(function ($routeProvider, $httpProvider, ChartJsProvider) {
/*	  $sceDelegateProvider.resourceUrlWhitelist([
    'http://www.http://52.11.253.201:7070/**'
  ]);*/

    $routeProvider.when('/RegisterSources',
    {
      templateUrl:    'files/RegisterSources.html',
      controller:     'RegisterSourcesCtrl'
    });
    $routeProvider.when('/DataMover',
    {
      templateUrl:    'files/DataMover.html',
      controller:     'DataMovertCtrl'
    });
    $routeProvider.when('/BulkDataMover',
    {
      templateUrl:    'files/BulkDataMover.html',
      controller:     'BulkDataMoverCtrl'
    });
	$routeProvider.when('/TestDataManagement',
    {
      templateUrl:    'files/TestDataManagement.html',
      controller:     'TestDataGeneratorCtrl'
    });
	$routeProvider.when('/FederatedQueries',
    {
      templateUrl:    'files/FederatedQueries.html',
      controller:     'FederatedQueriesCtrl'
    });
	$routeProvider.when('/FormatPreservingEncryption',
    {
      templateUrl:    'files/FormatPreservingEncryption.html',
      controller:     'FormatPreservingEncryptionCtrl'
    });
	$routeProvider.when('/BICapabilities',
    {
      templateUrl:    'files/BICapabilities.html',
      controller:     'BICapabilitiesCtrl'
    });
	$routeProvider.when('/Dashboard',
    {
      templateUrl:    'files/Dashboard.html'
     // controller:     'DashboardCtrl'
    });
    $routeProvider.otherwise(
    {
      redirectTo:     '/RegisterSources',
      controller:     'RegisterSourcesCtrl', 
    });
});
/*app.config(function($sceDelegateProvider) {
  $sceDelegateProvider.resourceUrlWhitelist([
    'http://www.http://52.11.253.201:7070/ATAW/**'
  ]);
});*/
app.controller('NavCtrl', 
['$scope', '$location', function ($scope, $location, $http) {  
  $scope.navClass = function (page) {
    var currentRoute = $location.path().substring(1) || 'RegisterSources';
    return page === currentRoute ? 'active' : '';
	
  };
  
}]);
app.controller('sources', function($scope, $http, ngDialog) {
  
});
app.controller('DataMovertCtrl', function($scope, $http, ngDialog) {

  $scope.$emit('LOAD');
  $http.get(serviceurl+"/getSOURCES")
    .success(function (data)
	 {
		 
		 //alert(data);
		 $scope.names = data;
		 $scope.targetnames = data;
		 $scope.$emit('UNLOAD');
		 }
	 
	 );

	 ////////////// GetSourcetable values on select option ///////////////////////
	 $scope.GetSourcetable = function (instances) {
		// alert(instances);
		 $scope.$emit('LOAD');
		//$scope.loading = !$scope.loading;
                var getSourcetb = $scope.Sourceinstances;
				$http.get(serviceurl+'/getSourceTables?serverData={"Instance_Name":"'+getSourcetb+'"}')
						.success(function (data)
						 {
							// alert(data);
							 $scope.tablebnames = data;
							 
							 $scope.$emit('UNLOAD')
							 }
						 
						 );
            };
			
$scope.deltaCondition = function(){
				$scope.sqlquery = "Select * from "+ $scope.Sourceobject;
			}
$scope.dataMoverSubmit = function(){
	debugger;
 
	if(!$scope.Sourceinstances || !$scope.Sourceinstances || !$scope.Sourceextract || !$scope.jobName || !$scope.Targetinstances || !$scope.targetObject || !$scope.TargetLoad || !$scope.Filesubtype ){
	
                ngDialog.openConfirm({
                    template: '<p>All fields are mandatory</p><div class="ngdialog-buttons"><button type="button" class="ngdialog-button ngdialog-button-primary" ng-click="confirm(1)">OK</button></div>',
                     plain: true,
                     className: 'ngdialog-theme-default'
                });
   	return false;
	}else{
			
	}
	
$scope.$emit('LOAD');
var obj = new Object();
		var jsonObject = new Object();
		var sourceArray = [];
				obj.Source_Instance = $scope.Sourceinstances;
				obj.Source_Object = $scope.Sourceobject;
				sourceArray.push(obj);
						
				jsonObject.Sources = sourceArray;
			
				jsonObject.Target_Instance = $scope.Targetinstances;
				jsonObject.Target_Object = $scope.targetObject;
				jsonObject.Type_of_Load = $scope.Sourceextract;
				jsonObject.SQL_Query = $scope.sqlquery;
				jsonObject.Tgt_Load_Type = $scope.TargetLoad;
				if(jsonObject.Tgt_Load_Type == "Truncate and Load"){
					jsonObject.Tgt_Load_Type = "createOverwrite";
				}
				jsonObject.JobName = $scope.jobName;
				jsonObject.FILE_SUB_TYPE = $scope.Filesubtype;
				
				jsonObject.JobDescription = "Moving Data From " + $scope.Sourceinstances + "."+$scope.Sourceobject + " to " + $scope.Targetinstances + "." + $scope.targetObject;	
				jsonObject.Owner = " ROOT_HDFS ";	// need to get input from Audit tables from backend

					
				alert(JSON.stringify(jsonObject));
			var jsonString = JSON.stringify(jsonObject);
			console.log(jsonString);
			var respjsonString= '';
			//$http.post(serviceurl+'/generateXML?serverData='+jsonString)
					$http({
						method: 'POST',
						headers: {
							'Content-type': 'application/json'
						},
						url: serviceurl+'/generateXML?serverData=' + jsonString,
						responseType:'json'
						})
						.success(function (response)
						 {
							 debugger;
							console.log(response);
		var resp = response;		
		if(resp.status == 0 ){
			respText = "Successfully Submitted!";
		}else{
			respText = "Failed to submit";
		}
		ngDialog.openConfirm({
                    template: '<p>'+respText+'</p><div class="ngdialog-buttons"><button type="button" class="ngdialog-button ngdialog-button-primary" ng-click="confirm(1)">OK</button></div>',
                     plain: true,
                     className: 'ngdialog-theme-default'
                });
				$scope.$emit('UNLOAD');
					})
						 .error(function (data)
						 {
							 console.log(data);
							respjsonString = JSON.stringify(data);
							// alert(respjsonString);
							 
							  ngDialog.openConfirm({
                    template: '<p>Failure</p>' +
                              '<div class="ngdialog-buttons"><button type="button" class="ngdialog-button ngdialog-button-primary" ng-click="confirm(1)">OK</button></div>',
                            plain: true,
                            className: 'ngdialog-theme-default'
                		}); // ngDialog end
						 $scope.$emit('UNLOAD');
						 }
						 );
			
};
  $scope.datamoverReset = function(){
	  $scope.Sourceinstances = '';
	  $scope.Sourceobject = '';
	  $scope.Sourceextract = '';
	  $scope.jobName = '';
	  $scope.sqlquery = '';
	  $scope.Targetinstances = '';
	  $scope.targetObject = '';
	  $scope.TargetLoad = '';
	  $scope.Filesubtype = '';
  };
  $scope.disabled = true;
 
  $scope.SourceExt = function (Sourceextract){
	  if(Sourceextract === "data"){
	  $scope.disabled = false;	  
	  }else
	  {
		  $scope.disabled = true;
	  }
  };
});/// Data Mover Controller End

app.controller('BulkDataMoverCtrl', function($scope, $http, $compile, ngDialog) {


  //console.log('inside BulkDataMoverCtrl controller');
  $scope.$emit('LOAD');
  $http.get(serviceurl+"/getSOURCES")
    .success(function (data)
	 {
		 
		 //alert(data);
		 $scope.names = data;
		 $scope.targetnames = data;
		 $scope.$emit('UNLOAD');
		 }
	 
	 );
 ////////////// get database values on select option ///////////////////////
	 $scope.GetDb = function (instances) {
		 //alert(instances);
		 $scope.$emit('LOAD');
		//$scope.loading = !$scope.loading;
                var getSourceinstances = $scope.Sourceinstances;
				$http.get(serviceurl+'/getDatabases?serverData={"Instance_Name":"'+getSourceinstances+'"}')
						.success(function (data)
						 {
							// alert(data);
							 $scope.dbnames = data;							 
							 $scope.$emit('UNLOAD');
							 }
						 
						 );
            };
////////////// get tables values on select option ///////////////////////
	 $scope.GetTable = function () {
		 
		 $scope.$emit('LOAD');
		 $scope.currentPage = 1;
		 $scope.pageSize = 0;
		 $scope.tblname = [];
                var getSourcedb = $scope.Sourcedb;
               // alert("Selected Value: " + getSourceinstances);
				
				$http.get(serviceurl+'/getTables?serverData={"Database_Name":"'+getSourcedb+'","Instance_Name":"'+$scope.Sourceinstances+'"}')
						.success(function (data)
						 {
							 //alert(data);
							 debugger;
							 $scope.getablenames = data;
							 alert($scope.getablenames.length);
							 
							 for(i=0; i <=$scope.getablenames.length-1; i++){
								$scope.tblname.push({name: $scope.getablenames[i], value: $scope.getablenames[i]});
								
							 }
							 console.log($scope.tblname);
							 $scope.$emit('UNLOAD');
							 
							 });
			
            };
/*			  $scope.pageChangeHandler = function(num) {
      console.log('meals page changed to ' + num);
  };*/
 $scope.sortingLog = [];
  
  $scope.sortableOptions = {
	 // debugger;
    update: function(e, ui) {
		debugger;
      var logEntry = $scope.tblname.map(function(i){
        return i.name;
      }).join(', ');
      $scope.sortingLog.push('Update: ' + logEntry);
    },
    stop: function(e, ui) {
      // this callback has the changed model
      var logEntry = $scope.tblname.map(function(i){
        return i.name;
      }).join(', ');
      $scope.sortingLog.push('Stop: ' + logEntry);
    }
  };
	////////////// get database values on select option ///////////////////////
	 $scope.targetGetDb = function () {
		 $scope.$emit('LOAD');

		 //alert(instances);
                var gettargettances = $scope.Targetinstances;
				$http.get(serviceurl+'/getDatabases?serverData={"Instance_Name":"'+gettargettances+'"}')
						.success(function (data)
						 {
							 //alert(data);
							 $scope.targetdbnames = data;
								$scope.$emit('UNLOAD');
							 }
						 
						 );
            };
			
	 var targetJson=[];
	 var sourceJson=[];
	// var tablesArray = [];
	 $scope.selection=[];
	 $scope.selected = [];
	 var jsonObject = new Object();

//////////////////////////////  check all ///////////
$scope.toggleSelection = function (item, list) {
    var idx = list.indexOf(item);
    if (idx > -1) {
      list.splice(idx, 1);
    }
    else {
      list.push(item);
    }
	//alert(list);
  };
 $scope.exists = function (item, list) {
    return list.indexOf(item) > -1;
  };
 $scope.isChecked = function() {
    return $scope.selected.length === $scope.tblname.length;
  };
$scope.checkAll = function () {
		debugger;
		if ($scope.selected.length === $scope.tblname.length) {
      $scope.selected = [];
    } else if ($scope.selected.length === 0 || $scope.selected.length > 0) {
      $scope.selected = $scope.tblname.slice(0);
    }
			};
	////////// Submit Button ////////////////////
	 $scope.dataMoverSubmit = function(){
		 debugger;
	 
		if($scope.selected.length >= 1 ){
			$scope.selectedarrayvalue = "checked";	
		}else{
			$scope.selectedarrayvalue = "";	
		}
		//alert($scope.selection);
if(!$scope.Sourceinstances || !$scope.Sourcedb || !$scope.Targetinstances || !$scope.TargetLoad || !$scope.Targetdb || !$scope.selectedarrayvalue ){
	
                ngDialog.openConfirm({
                    template: '<p>All fields are mandatory</p><div class="ngdialog-buttons"><button type="button" class="ngdialog-button ngdialog-button-primary" ng-click="confirm(1)">OK</button></div>',
                     plain: true,
                     className: 'ngdialog-theme-default'
                });
   //	return false;
	}else{
			
	}
	$scope.$emit('LOAD');
	//alert($scope.selection.length);
	debugger;
		 for (var i = 0; i < $scope.selected.length; i++) {
	targetJson.push({Target_Instance:$scope.Targetinstances,Target_Object:$scope.selected[i],SQL_Query:"Select * from "+$scope.selected[i],FILE_SUB_TYPE:""});			
	
	sourceJson.push({Source_Instance:$scope.Sourceinstances,Source_Object:$scope.selected[i],FILE_SUB_TYPE:""});
	debugger;		
				
      
    }
	jsonObject.Tgt_Load_Type = $scope.TargetLoad;
	jsonObject.JobName = "Blk_" + $scope.targetJson;
	jsonObject.Type_of_Load = "Full";
	jsonObject.Targets = targetJson;
	jsonObject.Sources=sourceJson;
	jsonObject.FILE_SUB_TYPE = "BLK DM";
	jsonObject.JobDescription = "Bulk Data Mover Job" ;	
	jsonObject.Owner = " BLK DM ";	// need to get input from Audit tables from backend		
	var jsonString = JSON.stringify(jsonObject);
	
	alert(jsonString);
	console.log(jsonString);
	
	$http({
	method: 'POST',
	headers: {
        'Content-type': 'application/json'
    },
	url: serviceurl+'/generateBulkXML?serverData=' + jsonString,
	responseType:'json'
	//data: jsonString
	})
	.success(function(response)
	{
		
		sourceJson=[];
		targetJson=[];
		debugger;
		console.log(response);
		var resp = response;		
		if(resp.Status == 0 ){
			respText = "Successfully Submitted!";
		}else{
			respText = "Failed to submit";
		}
		ngDialog.openConfirm({
                    template: '<p>'+respText+'</p><div class="ngdialog-buttons"><button type="button" class="ngdialog-button ngdialog-button-primary" ng-click="confirm(1)">OK</button></div>',
                     plain: true,
                     className: 'ngdialog-theme-default'
                }); // ngDialog end
		$scope.$emit('UNLOAD');
	})
	.error(function(response)
	{
		sourceJson=[];
		targetJson=[];
		debugger;
		//alert(response);
		//alert("Error sending data ");
		ngDialog.openConfirm({
                    template: '<p>Error sending data</p>' +
                              '<div class="ngdialog-buttons"><button type="button" class="ngdialog-button ngdialog-button-primary" ng-click="confirm(1)">OK</button></div>',
                            plain: true,
                            className: 'ngdialog-theme-default'
                		}); // ngDialog end
		$scope.$emit('UNLOAD');		
		//$scope.errormsg = data;
		
	});

	 };
	 
	 $scope.datamoverReset = function(){
		 $scope.getablenames = [];
		 $scope.Sourceinstances = '';
		 $scope.Sourcedb = '';
		 $scope.Targetinstances = '';
		 $scope.Targetdb = '';
		 $scope.TargetLoad = '';
	 };


	
	
/*	 $scope.checkboxes = { 'checked': false, items: {} };

    // watch for check all checkbox
    $scope.$watch('checkboxes.checked', function(value) {
        angular.forEach($scope.orderedData, function(item) {
            if (angular.isDefined(item.id)) {
                $scope.checkboxes.items[item.id] = value;
            }
        });
    });

    // watch for data checkboxes
    $scope.$watch('checkboxes.items', function(values) {
        if (!$scope.users) {
            return;
        }
        var checked = 0, unchecked = 0,
            total = $scope.users.length;
        angular.forEach($scope.users, function(item) {
            checked   +=  ($scope.checkboxes.items[item.id]) || 0;
            unchecked += (!$scope.checkboxes.items[item.id]) || 0;
        });
        if ((unchecked == 0) || (checked == 0)) {
            $scope.checkboxes.checked = (checked == total);
        }
        // grayed checkbox
        angular.element(document.getElementById("select_all")).prop("indeterminate", (checked != 0 && unchecked != 0));
    }, true);*/




});////// bulk data mover end

app.controller('TestDataGeneratorCtrl', function ($scope, $compile, $http, ngDialog) {
    var tempData = [];
	     $scope.currentPage = 1;
		 $scope.pageSize = 0;
	$scope.$emit('LOAD');
$http.defaults.headers.put = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, X-Requested-With'
        };
        $http.defaults.useXDomain = true;
		$http.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
  $http.get(serviceurl+"/getInstances")
    .success(function (data)
	 {		 
		 //alert(data);
		 $scope.names = data;
		 $scope.targetnames = data;
		 $scope.$emit('UNLOAD');
		 }	 
	 );
	 
	 
	 ////////////// get database values on select option ///////////////////////
	 $scope.GetDb = function (instances) {
		 //alert(instances);
		 $scope.$emit('LOAD')
		//$scope.loading = !$scope.loading;
                var getSourceinstances = $scope.Sourceinstances;
				$http.get(serviceurl+'/getDatabases?serverData={"Instance_Name":"'+getSourceinstances+'"}')
						.success(function (data)
						 {
							// alert(data);
							 $scope.dbnames = data;
							 
							 $scope.$emit('UNLOAD')
							 }
						 
						 );
            };
	  ////////////// get tables values on select option ///////////////////////
	 $scope.GetTable = function () {
		 $scope.$emit('LOAD');

                var getSourcedb = $scope.Sourcedb;
               // alert("Selected Value: " + getSourceinstances);
				
				$http.get(serviceurl+'/getTables?serverData={"Database_Name":"'+getSourcedb+'","Instance_Name":"'+$scope.Sourceinstances+'"}')
						.success(function (data)
						 {
							// alert(data);
							 $scope.getablenames = data;

							$scope.$emit('UNLOAD');
							 
							 }
						 
						 );
            };
		$scope.lols = false;	
	////////////// get coulmns values on select option ///////////////////////
	$scope.GetCoulm = function () {
		$scope.$emit('LOAD');

                var getSourcetable = $scope.Sourcetable;
               // alert("Selected Value: " + getSourceinstances);
				
				$http.get(serviceurl+'/sendTestDataColumnJSON?serverData={"Database_Name":"'+$scope.Sourcedb+'","Instance_Name":"'+$scope.Sourceinstances+'","Table_Name":"'+getSourcetable+'"}')
						.success(function (data)
						 {
							 alert(data);
							 $scope.lols = true;
							 $scope.getablecoulmn = data;
							$scope.$emit('UNLOAD');
							 
							 }
						 
						 )
						 .error(function(data)
						 {
							 alert(data);
						 }
						 );
            };
			 $scope.sortingLog = [];
  
  $scope.sortableOptions = {
	 // debugger;
    update: function(e, ui) {
		debugger;
      var logEntry = $scope.getablecoulmn.map(function(i){
        return i.name;
      }).join(', ');
      $scope.sortingLog.push('Update: ' + logEntry);
    },
    stop: function(e, ui) {
      // this callback has the changed model
      var logEntry = $scope.getablecoulmn.map(function(i){
        return i.name;
      }).join(', ');
      $scope.sortingLog.push('Stop: ' + logEntry);
    }
  };
///////////////// Target  /////////////////////////////////////////////////////////////////////
			
			////////////// get database values on select option ///////////////////////
	 $scope.targetGetDb = function () {
		 $scope.$emit('LOAD');

		 //alert(instances);
                var gettargettances = $scope.Targetinstances;
				$http.get(serviceurl+'/getDatabases?serverData={"Instance_Name":"'+gettargettances+'"}')
						.success(function (data)
						 {
							 //alert(data);
							 $scope.targetdbnames = data;
								$scope.$emit('UNLOAD');
							 
							 }
						 
						 );
            };
	  ////////////// get tables values on select option ///////////////////////
	 $scope.TargetGetTable = function () {
		 $scope.$emit('LOAD');

                var getTargetdb = $scope.Targetdb;
               // alert("Selected Value: " + getSourceinstances);
				
				$http.get(serviceurl+'/getTables?serverData={"Database_Name":"'+getTargetdb+'","Instance_Name":"'+$scope.Sourceinstances+'"}')
						.success(function (data)
						 {
							// alert(data);
							 $scope.getTargetdbs = data;
							$scope.$emit('UNLOAD');
							 
							 }
						 
						 );
	 };
	 /////////////////////////////// show query for table /////////////////////////
	 $scope.lol = false; 
	 $scope.showQry = function (testdataDropdown){
		// alert($scope.myvalue);
		 if(testdataDropdown === "getReference" ){
			$scope.getReference = true; 
		if(testdataDropdown === "getDateBetween" )
			$scope.getDateBetween = true;
		 }
	 };
/*	 $( "#select" ).change(function() {
  alert( "Handler for .change() called." );
});*/
	///////////// Buttons of test data generate import existing tab ////////////////////////////////////////
  //Bind the sub menus based on main menu//
    var subMenusData = [];
	
    $scope.getMenusById = function ($index) {
        debugger;
            // alert($index);
			$scope.$emit('LOAD');
 
  
        $http.get(serviceurl+'/getDatabases?serverData={"Instance_Name":"' + $index + '"}')
            .success(function (data) {
                debugger;                    
                $scope.subMenusData = data;
                 $scope.$emit('UNLOAD');
            });
			//var sublists= $index+sublists;
        $scope.sublists = $scope.subMenusData;      
        $scope.subMenuShow = true;
		//$scope.$index = false;
   		//$scope.$index = !$scope.$index;
    };
	
	 /*$scope.getMenusById = function (MenuTitle) {
	     debugger;
	     var subMenusData = [];
	     $http.get(serviceurl+'/getDatabases?serverData={"Instance_Name":"' + MenuTitle + '"}')
             .success(function (data) {
                debugger;
                 subMenusData.push({ 
                     MenuItems: data 
                 });
                
             }
             );
	   
	 };*/
	 $scope.getablecoulmn = [];
	 $scope.addRowbtn = function () {
	     //debugger;
	     $scope.getablecoulmn.push({COLUMN_NAME:'',COLUMN_TYPE:'',COLUMN_SIZE:''});
		};
	    // Delete Mulitple rows
    $scope.deleteRow = function () {
        debugger;
		$scope.selectedAll = false;
        $scope.selectedIdsArray = [{}];
        $scope.approvalitemsNew = [];
        angular.forEach($scope.getablecoulmn, function (item) {
            if (!!item.selected) {
                $scope.selectedIdsArray.push({ Reqid: item.Date, Status: "Approved" });
                $scope.CheckAllData = false;
                item.hideThis = true;
            }
            else {
                $scope.approvalitemsNew.push(item);
            }
        });
        $scope.getablecoulmn = $scope.approvalitemsNew;
        $scope.getIndexvalues = [];
    };

    $scope.addSingleRowbtn = function (index) {
        debugger;
       // alert('Single row added');
        $scope.getablecoulmn.splice(index + 1, 0, { COLUMN_NAME: '', COLUMN_TYPE: '', COLUMN_SIZE: '' })
        //$scope.getablecoulmn.push(index+1,{COLUMN_NAME:'',COLUMN_TYPE:'',COLUMN_SIZE:''});

    }
    $scope.removeSingleRowPerson = function (index) {
        debugger;
        //alert('Single row delete');
        // $scope.approvalitemsNew = [];
        
        $scope.getablecoulmn.splice(index, 1);
    };
	$scope.exists = function (item, list) {
	debugger;
    return list.indexOf(item) > -1;
  };

	$scope.checkAll = function () {
		debugger;
if ($scope.selectedAll) {
            $scope.selectedAll = true;
        } else {
            $scope.selectedAll = false;
        }
        angular.forEach($scope.getablecoulmn, function (item) {
            item.selected = $scope.selectedAll;
        });
		};
////////////////////// Create new structure tab table  /////////////////////////////////////
	 $scope.Newgetablecoulmn = [];
	$scope.NewaddRowbtn = function () {
		//debugger;
		$scope.Newgetablecoulmn.push({COLUMN_NAME:'',COLUMN_TYPE:'',COLUMN_SIZE:''});
	};
	$scope.NewdeleteRow = function () {
        debugger;
		$scope.NewselectedAll = false;
        $scope.selectedIdsArray = [{}];
        $scope.approvalitemsNew = [];
        angular.forEach($scope.Newgetablecoulmn, function (item) {
            if (!!item.selected) {
                $scope.selectedIdsArray.push({ Reqid: item.Date, Status: "Approved" });
                $scope.CheckAllData = false;
                item.hideThis = true;
            }
            else {
                $scope.approvalitemsNew.push(item);
            }
        });
        $scope.Newgetablecoulmn = $scope.approvalitemsNew;
        $scope.getIndexvalues = [];
    };
	$scope.Newexists = function (item, list) {
	debugger;
    return list.indexOf(item) > -1;
  };

	$scope.NewcheckAll = function () {
		debugger;
if ($scope.NewselectedAll) {
            $scope.NewselectedAll = true;
        } else {
            $scope.NewselectedAll = false;
        }
        angular.forEach($scope.Newgetablecoulmn, function (item) {
            item.selected = $scope.NewselectedAll;
        });
		};


/////////////////////////////////////////////////////////////////	
	
	
	 var tempJson=[];
	 var jsonObject = new Object();
	 $scope.testDataGenerate = function(){
		 debugger;
		 var genselectfnlist = $scope.testdataDropdown;
		
		
		if(!$scope.Sourceinstances || !$scope.Sourcedb || !$scope.Sourcetable || !$scope.recordCount || !$scope.Targetinstances || !$scope.Targetdb || !$scope.targetObject || !$scope.targetLoad ){
			ngDialog.openConfirm({
                    template: '<p>All fields are mandatory</p><div class="ngdialog-buttons"><button type="button" class="ngdialog-button ngdialog-button-primary" ng-click="confirm(1)">OK</button></div>',
                     plain: true,
                     className: 'ngdialog-theme-default'
                });
   	return false;
	}
			
			 $scope.$emit('LOAD');
		  //alert(lol);
		// var genSourceinstances = $scope.;
		// alert($scope.getablecoulmn.length);
		 $scope.contents = [];
		 for (var i = 0; i < $scope.getablecoulmn.length; i++) {
			  var selected = "#select"+i;
			  var qry = "#inputqry"+i;
		  	  var dropvalue = $(selected).val();
			  var inputqry = $(qry).val();
			
			//added on Jul-13
			var qry_val = "#inputValue"+i;
			var inputValue = $(qry_val).val();
				
				
				if(dropvalue == "getReference"){
					//tempJson.push({SOURCE_FUNCTION:(dropvalue+'('+$scope.getablecoulmn[i].COLUMN_NAME+','+$scope.Sourceinstances+','+"select "+$scope.getablecoulmn[i].COLUMN_NAME+" from "+$scope.Sourcedb+"."+$scope.Sourcetable+')')});
					tempJson.push({SOURCE_FUNCTION:(dropvalue+'('+$scope.getablecoulmn[i].COLUMN_NAME+','+$scope.Sourceinstances+','+inputqry+')')});
					
				}else if(dropvalue == "getBirthDate"){
					tempJson.push({SOURCE_FUNCTION:(dropvalue+'(MM/dd/yyyy)')});
				}else if(dropvalue == "getDateBetween"){
//					tempJson.push({SOURCE_FUNCTION:(dropvalue+ '('+'"'+inputValue+'"'+')')});
					tempJson.push({SOURCE_FUNCTION:(dropvalue+ '('+inputValue+')')});
				}
				else{
					tempJson.push({SOURCE_FUNCTION:(dropvalue+'('+$scope.getablecoulmn[i].COLUMN_SIZE+')')});
			 //alert($scope.getablecoulmn.testdataDropdown);
			 
				}
      
    }
	
		jsonObject.Sources = tempJson;
		jsonObject.RECORD_COUNT = $scope.recordCount;	
		jsonObject.Table_Name = $scope.Sourcetable;
		jsonObject.Target_Object = $scope.targetObject;
		jsonObject.FILE_SUB_TYPE = "TDM_File";	
		jsonObject.JobDescription = "Test Data file creation for " + $scope.Targetinstances + "."+
						$scope.targetObject ;	
		jsonObject.Owner = "TDM";	// need to get input from Audit tables from backend
		jsonObject.JobName = $scope.targetObject + "_file";	
		jsonObject.Source_Instance = "NA";
		jsonObject.Tgt_Load_Type = "NA";
		jsonObject.Source_Object = "NA";
		jsonObject.Target_Instance = "linux filessystem";
		var jsonString = JSON.stringify(jsonObject);
	
	//var  = tempJson +{, "RECORD_COUNT":"10","Table_Name":"REGIONS","Target_Object":"newObj"};

	console.log(jsonString);

	$http({
	method: 'POST',
	headers: {
        'Content-type': 'application/json'
    },
	url: serviceurl+'/generateTestDataString?serverData=' + jsonString,
	responseType:'json'
	})
	.success(function(response)
	{
		
		tempJson=[];
		debugger;
		console.log(response);
		var resp = response;		
		if(resp.Status == 0 ){
			respText = "Successfully generated!";
		}else{
			respText = "Failed to generate the file";
		}
		ngDialog.openConfirm({
                    template: '<p>'+respText+'</p><div class="ngdialog-buttons"><button type="button" class="ngdialog-button ngdialog-button-primary" ng-click="confirm(1)">OK</button></div>',
                     plain: true,
                     className: 'ngdialog-theme-default'
                });
		$scope.$emit('UNLOAD');
	})
	.error(function(response)
	{
		tempJson=[];
		debugger;
		alert(response);
		//$scope.errormsg = data;
		console.log(response);
		//alert("failure ");
		ngDialog.openConfirm({
                    template: '<p>Failure</p><div class="ngdialog-buttons"><button type="button" class="ngdialog-button ngdialog-button-primary" ng-click="confirm(1)">OK</button></div>',
                     plain: true,
                     className: 'ngdialog-theme-default'
                });
				$scope.$emit('UNLOAD');
	});

	 };
	 
	 
	 $scope.NewtestDataGenerate = function(){
		 

		// var genSourceinstances = $scope.;
		 //alert($scope.Newgetablecoulmn.length);
		 
		 if(!$scope.NewTargetinstances || !$scope.NewTargetdb || !$scope.NewrecordCount || !$scope.NewtargetObject || !$scope.NewtargetLoad){
			 ngDialog.openConfirm({
                    template: '<p>All fields are mandatory</p><div class="ngdialog-buttons"><button type="button" class="ngdialog-button ngdialog-button-primary" ng-click="confirm(1)">OK</button></div>',
                     plain: true,
                     className: 'ngdialog-theme-default'
                });
   	return false;
	}
		 $scope.$emit('LOAD');
		 $scope.contents = [];
		 for (var i = 0; i < $scope.Newgetablecoulmn.length; i++) {
			 var selected = "#newselect"+i;
		  		var dropvalue = $(selected).val();
				//$scope.newdropdown = $scope.newdropdown+i;
			 //alert($scope.Newgetablecoulmn[i].COLUMN_SIZE);
			 if(dropvalue == "getBirthDate"){
					tempJson.push({SOURCE_FUNCTION:(dropvalue+'(MM/dd/yyyy)')});
				}
				else if(dropvalue == "getDateBetween"){
					tempJson.push({SOURCE_FUNCTION:(dropvalue+'(MM/dd/yyyy)')});
				}
				else{
					tempJson.push({SOURCE_FUNCTION:(dropvalue+'('+$scope.Newgetablecoulmn[i].COLUMN_SIZE+')')});
			 //alert($scope.getablecoulmn.testdataDropdown);
			 
				}
			 //tempJson.push({SOURCE_FUNCTION:('('+$scope.Newgetablecoulmn[i].COLUMN_SIZE+')')});
      
    }
	debugger;
		jsonObject.Sources = tempJson;
		jsonObject.RECORD_COUNT = $scope.NewrecordCount;	
		jsonObject.Table_Name = $scope.NewTargetdb;
		jsonObject.Target_Object = $scope.NewtargetObject;
	// updated code for logging data into runstat table	
		jsonObject.JobName = $scope.NewtargetObject + "_file";
		jsonObject.FILE_SUB_TYPE = "TDM_File";	
		jsonObject.JobDescription = "Test Data file creation " + $scope.NewtargetObject ;	
		jsonObject.Owner = " TDM ";	// need to get input from Audit tables from backend
		jsonObject.Source_Instance = "NA";
		jsonObject.Tgt_Load_Type = "NA";
		jsonObject.Source_Object = "NA";	
		jsonObject.Target_Instance = "linux filessystem";
		var jsonString = JSON.stringify(jsonObject);
	//var  = tempJson +{, "RECORD_COUNT":"10","Table_Name":"REGIONS","Target_Object":"newObj"};
	alert(jsonString);
	console.log(jsonString);
	debugger;
	$http({
	method: 'POST',
	headers: {
        'Content-type': 'application/json'
    },
	url: serviceurl+'/generateTestDataString?serverData=' + jsonString,
	responseType:'json'
	})
	.success(function(response)
	{
		debugger;
		console.log(response);
		//alert(response);
		tempJson=[];
		var resp = response;		
		if(resp.Status == 0 ){
			respText = "Successfully Submitted!";
		}else{
			respText = "Failed to submit";
		}
		ngDialog.openConfirm({
                    template: '<p>'+respText+'</p><div class="ngdialog-buttons"><button type="button" class="ngdialog-button ngdialog-button-primary" ng-click="confirm(1)">OK</button></div>',
                     plain: true,
                     className: 'ngdialog-theme-default'
                });
		$scope.$emit('UNLOAD');
	})
	.error(function(response)
	{
		debugger;
		tempJson=[];
		//alert(response);
		//$scope.errormsg = data;
		//alert("failure ");
		ngDialog.openConfirm({
                    template: '<p>Failure</p><div class="ngdialog-buttons"><button type="button" class="ngdialog-button ngdialog-button-primary" ng-click="confirm(1)">OK</button></div>',
                     plain: true,
                     className: 'ngdialog-theme-default'
                });
		console.log(response);
		$scope.$emit('UNLOAD');
	}
	 
	
	);

	 };
/////////////////////// Buttons of test data loadfile import existing tab /////////////////////////// 
	 $scope.testLoadfiles = function(){
		 $scope.$emit('LOAD');
		 if(!$scope.Sourceinstances || !$scope.Sourcedb || !$scope.Sourcetable || !$scope.recordCount || !$scope.Targetinstances || !$scope.Targetdb || !$scope.targetObject || !$scope.targetLoad ){
			ngDialog.openConfirm({
                    template: '<p>All fields are mandatory</p><div class="ngdialog-buttons"><button type="button" class="ngdialog-button ngdialog-button-primary" ng-click="confirm(1)">OK</button></div>',
                     plain: true,
                     className: 'ngdialog-theme-default'
                });
   	return false;
	}
		var jsonObject = new Object();
		var obj = new Object();
		var sourceArray = [];
			obj.Source_Instance = $scope.Sourceinstances;
			obj.Source_Object = $scope.Sourcetable + ".dat";		
			sourceArray.push(obj);
			jsonObject.Sources = sourceArray;	
			jsonObject.Target_Instance = $scope.Targetinstances;
			jsonObject.Database_Name = $scope.Sourcedb;
			jsonObject.Target_Object = $scope.targetObject;
			jsonObject.Type_of_Load = "Full";
			jsonObject.Tgt_Load_Type = $scope.targetLoad;
			jsonObject.SQL_Query = "Select * from " + $scope.Sourcetable;
			jsonObject.JobName = $scope.targetObject + "_load";
			jsonObject.FILE_SUB_TYPE = "TDM";	
			jsonObject.JobDescription = "Test Data Creation for " + $scope.Targetinstances + "."+
						$scope.targetObject ;	
			jsonObject.Owner = " TDM ";	// need to get input from Audit tables from backend
			
			var jsonString = JSON.stringify(jsonObject);
		//alert(jsonString);
		$http({
	method: 'POST',
	headers: {
        'Content-type': 'application/json'
    },
	url: serviceurl+'/generateTestDataXML?serverData=' + jsonString,
	responseType:'json'
	})
	.success(function(response)
	{
		debugger;
		console.log(response);
		//alert(response);
		var resp = response;		
		if(resp.Status == 0 ){
			respText = "Successfully loaded file!";
		}else{
			respText = "Failed to load file";
		}
		ngDialog.openConfirm({
                    template: '<p>'+respText+'</p><div class="ngdialog-buttons"><button type="button" class="ngdialog-button ngdialog-button-primary" ng-click="confirm(1)">OK</button></div>',
                     plain: true,
                     className: 'ngdialog-theme-default'
                });
		$scope.$emit('UNLOAD');
	})
	.error(function(response)
	{
		debugger;
		alert(response);
		//$scope.errormsg = data;
		//alert("failure ");
		console.log(response);
		ngDialog.openConfirm({
                    template: '<p>Failure</p><div class="ngdialog-buttons"><button type="button" class="ngdialog-button ngdialog-button-primary" ng-click="confirm(1)">OK</button></div>',
                     plain: true,
                     className: 'ngdialog-theme-default'
                });
		$scope.$emit('UNLOAD');
	}
	 
	
	);
		
	 };
	 
	 $scope.NewtestLoadfiles = function(){
		 	 if(!$scope.NewTargetinstances || !$scope.NewTargetdb || !$scope.NewrecordCount || !$scope.NewtargetObject || !$scope.NewtargetLoad){
			 ngDialog.openConfirm({
                    template: '<p>All fields are mandatory</p><div class="ngdialog-buttons"><button type="button" class="ngdialog-button ngdialog-button-primary" ng-click="confirm(1)">OK</button></div>',
                     plain: true,
                     className: 'ngdialog-theme-default'
                });
   	return false;
	}
		 $scope.$emit('LOAD');
		var jsonObject = new Object();
		var obj = new Object();
		var sourceArray = [];
			obj.Source_Instance = $scope.NewTargetinstances;
			obj.Source_Object = $scope.NewtargetObject + ".dat";		
			sourceArray.push(obj);
			jsonObject.Sources = sourceArray;	
			jsonObject.Target_Instance = $scope.NewTargetinstances;
			jsonObject.Database_Name = $scope.NewTargetdb;
			jsonObject.Target_Object = $scope.NewtargetObject;
			jsonObject.Type_of_Load = "Full";
			jsonObject.Tgt_Load_Type = $scope.NewtargetLoad;
			jsonObject.SQL_Query = "Select * from " + $scope.NewtargetObject;
			jsonObject.JobName = $scope.NewtargetObject + "_load";
			jsonObject.FILE_SUB_TYPE = "file";	
			var jsonString = JSON.stringify(jsonObject);
		//alert(jsonString);
		console.log(jsonString);
		$http({
	method: 'GET',
	headers: {
        'Content-type': 'application/json'
    },
	url: serviceurl+'/generateTestDataXML?serverData=' + jsonString,
	responseType:'json'
	})
	.success(function(response)
	{
		debugger;
		console.log(response);
		//alert(response);
		var resp = response;		
		if(resp.Status == 0 ){
			respText = "Successfully loaded file!";
		}else{
			respText = "Failed to load file";
		}
		ngDialog.openConfirm({
                    template: '<p>'+respText+'</p><div class="ngdialog-buttons"><button type="button" class="ngdialog-button ngdialog-button-primary" ng-click="confirm(1)">OK</button></div>',
                     plain: true,
                     className: 'ngdialog-theme-default'
                });
		$scope.$emit('UNLOAD');
	})
	.error(function(response)
	{
		debugger;
		//alert(response);
		//$scope.errormsg = data;
		//alert("failure ");
		console.log(response);
		ngDialog.openConfirm({
                    template: '<p>Failure</p><div class="ngdialog-buttons"><button type="button" class="ngdialog-button ngdialog-button-primary" ng-click="confirm(1)">OK</button></div>',
                     plain: true,
                     className: 'ngdialog-theme-default'
                });
		$scope.$emit('UNLOAD');
	});
		
	 };
//// ***************** Create new in Testdata ****************/////////////////////
////////////// get database values on select option ///////////////////////
	 $scope.NewtargetGetDb = function (instances) {
		 $scope.$emit('LOAD');
		 //alert(instances);
                var Newgettargettances = $scope.NewTargetinstances;
				//alert(instances);
				$http.get(serviceurl+'/getDatabases?serverData={"Instance_Name":"'+instances+'"}')
						.success(function (data)
						 {
							// alert(data);
							 $scope.Newtargetdbnames = data;
							 
							$scope.$emit('UNLOAD');
							 }
						 
						 );
            };
	  ////////////// get tables values on select option ///////////////////////
	 /*$scope.NewTargetGetTable = function () {
		 $scope.$emit('LOAD');
                var NewgetTargetdb = $scope.NewTargetdb;
               // alert("Selected Value: " + getSourceinstances);
				
				$http.get(serviceurl+'/getTables?serverData={"Database_Name":"'+NewgetTargetdb+'","Instance_Name":"'+$scope.Sourceinstances+'"}')
						.success(function (data)
						 {
							// alert(data);
							 $scope.NewgetTargetdbs = data;
							 
							 $scope.$emit('UNLOAD');
							 }
						 
						 );
	 };*/


	/* $scope.getMenusById = function (MenuTitle) {
	     debugger;
	     var subMenusData = [];
	     $http.get(serviceurl+'/getDatabases?serverData={"Instance_Name":"' + MenuTitle + '"}')
             .success(function (data) {
                debugger;
                 subMenusData.push({ 
                     MenuItems: data 
                 });
                
             }
             );
	   
	 };*/
	 $scope.getablecoulmn = [];
	  $scope.lols = false;
	 $scope.addRowbtn = function () {
	     debugger;
		  $scope.lols = true;
	     $scope.getablecoulmn.push({COLUMN_NAME:'',COLUMN_TYPE:'',COLUMN_SIZE:''});
	 };
	
$scope.hover = function() {
		//alert("hi");
        // Shows/hides the delete button on hover
        $scope.showDiv = ! $scope.showDiv;
    };
	$scope.clearForm = function (){
		$scope.Sourceinstances = '';
		$scope.Sourcedb = '';
		$scope.Sourcetable = '';
		$scope.recordCount = '';
		$scope.Targetinstances = '';
		$scope.Targetdb = '';
		$scope.targetObject = '';
		$scope.targetLoad = '';
		$scope.getablecoulmn = [];
		///// create new 
		$scope.Newgetablecoulmn = [];
		$scope.NewTargetinstances = '';
		$scope.NewTargetdb = '';
		$scope.NewrecordCount = '';
		$scope.NewtargetObject = '';
		$scope.NewtargetLoad = '';
	}
}); // End of the Testdata Controller


app.controller('FederatedQueriesCtrl', function($scope, $http, ngDialog) {
 // console.log('inside FederatedQueriesCtrl controller');
  $scope.$emit('LOAD');
  $http.get(serviceurl+"/getSOURCES")
    .success(function (data)
	 {
		 
		 //alert(data);
		 $scope.names = data;
		 $scope.targetnames = data;
		 $scope.$emit('UNLOAD');
		 }
	 
	 );
	 ////////////// GetSourcetable values on select option ///////////////////////
	 $scope.GetSourcetable = function (instances) {
		// alert(instances);
		 $scope.$emit('LOAD')
		//$scope.loading = !$scope.loading;
                var getSourcetb = $scope.Sourceinstances;
				$http.get(serviceurl+'/getSourceTables?serverData={"Instance_Name":"'+getSourcetb+'"}')
						.success(function (data)
						 {
							// alert(data);
							 $scope.tablebnames = data;
							 
							 $scope.$emit('UNLOAD')
							 }
						 
						 );
            };
	////////////// GetSourcetable values on select option ///////////////////////
	 $scope.GetSourcetable2 = function (instances) {
		// alert(instances);
		 $scope.$emit('LOAD')
		//$scope.loading = !$scope.loading;
                var getSourcetb = $scope.Sourceinstances2;
				$http.get(serviceurl+'/getSourceTables?serverData={"Instance_Name":"'+getSourcetb+'"}')
						.success(function (data)
						 {
							// alert(data);
							 $scope.tablebnames2 = data;
							 
							 $scope.$emit('UNLOAD')
							 }
						 
						 );
            };
////////////// GetSourcetable values on select option ///////////////////////
	 $scope.GetSourcetable3 = function (instances) {
		// alert(instances);
		 $scope.$emit('LOAD')
		//$scope.loading = !$scope.loading;
                var getSourcetb = $scope.Sourceinstances3;
				$http.get(serviceurl+'/getSourceTables?serverData={"Instance_Name":"'+getSourcetb+'"}')
						.success(function (data)
						 {
							// alert(data);
							 $scope.tablebnames3 = data;
							 
							 $scope.$emit('UNLOAD')
							 }
						 
						 );
            };

/////// submit button ///////////////////
$scope.fedQrySubmit = function (){
	if(!$scope.Sourceinstances || !$scope.Sourceobject || !$scope.Sourceinstances2 || !$scope.Sourceobject2 || !$scope.Sourceinstances3 || !$scope.Sourceobject3 || !$scope.Targetinstances || !$scope.targetObject || !$scope.fedjobname || !$scope.Filesubtype || !$scope.TargetLoad || !$scope.userqry ){
		ngDialog.openConfirm({
                    template: '<p>All fields are mandatory</p><div class="ngdialog-buttons"><button type="button" class="ngdialog-button ngdialog-button-primary" ng-click="confirm(1)">OK</button></div>',
                     plain: true,
                     className: 'ngdialog-theme-default'
                });
   	return false;
	}
var sourceArray = [];
var jsonObject = new Object();
for (i = 0; i < 3; i++) { 
			var source= new Object();
			if (i == 0){
				source.Source_Instance = $scope.Sourceinstances;
				source.Source_Object = $scope.Sourceobject;
				sourceArray.push(source);
				} else if(i == 1 ){
					source.Source_Instance = $scope.Sourceinstances2;
					source.Source_Object = $scope.Sourceobject2;
					sourceArray.push(source);
					} else if(i==2 ){
						source.Source_Instance = $scope.Sourceinstances3;
						source.Source_Object = $scope.Sourceobject3;
						sourceArray.push(source);
					}
		}
		//alert($scope.targetObject);
		jsonObject.Sources = sourceArray;
		jsonObject.Target_Instance = $scope.Targetinstances;
		jsonObject.Target_Object = $scope.targetObject;
		jsonObject.SQL_Query = $scope.userqry;
		jsonObject.Tgt_Load_Type = $scope.TargetLoad;
		jsonObject.JobName = $scope.fedjobname;
		jsonObject.FILE_SUB_TYPE = $scope.Filesubtype;
		jsonObject.JobDescription = "Federated Query to load  " + $scope.Targetinstances + "."+
						$scope.targetObject ;	
		jsonObject.Owner = " Federation ";	// need to get input from Audit tables from backend		
		var jsonString = JSON.stringify(jsonObject);
		alert(jsonString);
		$http({
	method: 'POST',
	headers: {
        'Content-type': 'application/json'
    },
	url: serviceurl+'/generateXML?serverData=' + jsonString,
	responseType:'json'
	//data: jsonString
	})
	.success(function(response)
	{
		debugger;
		console.log(response);
		//alert(response);
		
		var resp = response;		
		if(resp.Status == 0 ){
			respText = "Successfully Submitted!";
		}else{
			respText = "Failed to submit";
		}
		ngDialog.openConfirm({
                    template: '<p>'+respText+'</p><div class="ngdialog-buttons"><button type="button" class="ngdialog-button ngdialog-button-primary" ng-click="confirm(1)">OK</button></div>',
                     plain: true,
                     className: 'ngdialog-theme-default'
                });
		$scope.$emit('UNLOAD');
	})
	.error(function(response)
	{
		debugger;
		//alert(response);
		//alert("failure ");
		ngDialog.openConfirm({
                    template: '<p>Failure</p><div class="ngdialog-buttons"><button type="button" class="ngdialog-button ngdialog-button-primary" ng-click="confirm(1)">OK</button></div>',
                     plain: true,
                     className: 'ngdialog-theme-default'
                });
		$scope.$emit('UNLOAD');		
		//$scope.errormsg = data;
		
	});
}
}); // End of the FederatedQueriesCtrl
app.controller('FormatPreservingEncryptionCtrl', function($scope, $http, ngDialog) {
 // console.log('inside FormatPreservingEncryptionCtrl controller');
 	$scope.currentPage = 1;
	$scope.pageSize = 0;
 $scope.$emit('LOAD');
  $http.get(serviceurl+"/getSOURCES")
    .success(function (data)
	 {
		 
		 //alert(data);
		 $scope.names = data;
		 $scope.targetnames = data;
		 $scope.$emit('UNLOAD');
		 }
	 
	 );
	 ////////////// get database values on select option ///////////////////////
	 $scope.GetDb = function (instances) {
		 //alert(instances);
		 $scope.$emit('LOAD')
		//$scope.loading = !$scope.loading;
                var getSourceinstances = $scope.Sourceinstances;
				$http.get(serviceurl+'/getDatabases?serverData={"Instance_Name":"'+getSourceinstances+'"}')
						.success(function (data)
						 {
							// alert(data);
							 $scope.dbnames = data;
							 
							 $scope.$emit('UNLOAD')
							 }
						 
						 );
            };
			 ////////////// get tables values on select option ///////////////////////
	 $scope.GetTable = function () {
		 $scope.$emit('LOAD');

                var getSourcedb = $scope.Sourcedb;
               // alert("Selected Value: " + getSourceinstances);
				
				$http.get(serviceurl+'/getTables?serverData={"Database_Name":"'+getSourcedb+'","Instance_Name":"'+$scope.Sourceinstances+'"}')
						.success(function (data)
						 {
							 alert(data);
							 $scope.getablenames = data;

							$scope.$emit('UNLOAD');
							 
							 }
						 
						 );
            };
////////////// get coulmns values on select option ///////////////////////
	$scope.GetCoulm = function () {
		$scope.$emit('LOAD');

     // var getSourcetable = $scope.Sourcetable;
      // alert("Selected Value: " + getSourceinstances);
	 var jsonObject = new Object();
	jsonObject.Instance_Name = $scope.Sourceinstances;
	jsonObject.Database_Name = $scope.Sourcedb;
	jsonObject.Table_Name = $scope.Sourcetable;
	var jsonString = JSON.stringify(jsonObject);
				
				$http.get(serviceurl+'/sendTestDataColumnJSON?serverData='+jsonString)
						.success(function (data)
						 {
							 alert(data);
							 $scope.getablecoulmn = data;
							$scope.$emit('UNLOAD');
							 
							 }
						 
						 )
						 .error(function(data)
						 {
							 alert(data);
						 }
						 );
            };
////////////////////////////////////////////
$scope.sortingLog = [];
  
  $scope.sortableOptions = {
	 // debugger;
    update: function(e, ui) {
		debugger;
      var logEntry = $scope.getablecoulmn.map(function(i){
        return i.name;
      }).join(', ');
      $scope.sortingLog.push('Update: ' + logEntry);
    },
    stop: function(e, ui) {
      // this callback has the changed model
      var logEntry = $scope.getablecoulmn.map(function(i){
        return i.name;
      }).join(', ');
      $scope.sortingLog.push('Stop: ' + logEntry);
    }
  };		
////////////// get database values on select option ///////////////////////
	 $scope.targetGetDb = function () {
		 $scope.$emit('LOAD');

		 //alert(instances);
                var gettargettances = $scope.Targetinstances;
				$http.get(serviceurl+'/getDatabases?serverData={"Instance_Name":"'+gettargettances+'"}')
						.success(function (data)
						 {
							 //alert(data);
							 $scope.targetdbnames = data;
								$scope.$emit('UNLOAD');
							 
							 }
						 
						 );
            };
//////////////////////////	
$scope.encryptLoadfiles = function (){
	
	if(!$scope.Sourceinstances || !$scope.Sourcedb || !$scope.Sourcetable || !$scope.Targetinstances || !$scope.Targetdb || !$scope.targetObject || !$scope.TargetLoad){
		ngDialog.openConfirm({
                    template: '<p>All fields are mandatory</p><div class="ngdialog-buttons"><button type="button" class="ngdialog-button ngdialog-button-primary" ng-click="confirm(1)">OK</button></div>',
                     plain: true,
                     className: 'ngdialog-theme-default'
                });
   	return false;
	}
	var sourceJson = [];
	var jsonObject = new Object();
	 for (var i = 0; i < $scope.getablecoulmn.length; i++) {
			 var selected = "#encript"+i;
		  		var dropvalue = $(selected).val();
		
					sourceJson.push({SOURCE_FUNCTION:dropvalue});
			 
    }
		jsonObject.Sources = sourceJson;
		jsonObject.Source_Instance = $scope.Sourceinstances;
		jsonObject.Source_Object = $scope.Sourcetable;
		jsonObject.Target_Instance = $scope.Targetinstances;
		jsonObject.Target_Object = $scope.targetObject;
		jsonObject.JobName = "FPE_" + $scope.targetObject;
		jsonObject.FILE_SUB_TYPE = "FPE";	
		jsonObject.JobDescription = "FPE process for " + $scope.Sourceinstances + "." +
								$scope.Sourcetable;	
		jsonObject.Owner = " JDBC ";	// need to get input from Audit tables from backend		
		var jsonString = JSON.stringify(jsonObject);
		alert(jsonString);
		console.log(jsonString);
		$http({
	url: serviceurl+'/generateFPE?serverData=' + jsonString,
	method: 'POST',
	//dataType: 'json/text',
	headers: {
        'Content-type': 'application/json; charset=utf-8'
    },
	responseType:'json'
	})
	.success(function (response) 
	{
		debugger;
		console.log(response);
		//alert(response);
		var resp = response;		
		if(resp.status == 0 ){
			respText = "Successfully Submitted!";
		}else{
			respText = "Failed to submit";
		}
		ngDialog.openConfirm({
                    template: '<p>'+respText+'</p><div class="ngdialog-buttons"><button type="button" class="ngdialog-button ngdialog-button-primary" ng-click="confirm(1)">OK</button></div>',
                     plain: true,
                     className: 'ngdialog-theme-default'
                });
		$scope.$emit('UNLOAD');
	})
	.error(function(response)
	{
		debugger;
		//alert(response);
		//$scope.errormsg = data;
		//alert("failure ");
		ngDialog.openConfirm({
                    template: '<p>Failure</p><div class="ngdialog-buttons"><button type="button" class="ngdialog-button ngdialog-button-primary" ng-click="confirm(1)">OK</button></div>',
                     plain: true,
                     className: 'ngdialog-theme-default'
                });
		console.log(response);
		$scope.$emit('UNLOAD');
	}	
	);
	
	
	
	/*$http({
  method: 'POST',
  url: serviceurl+'/generateFPE?serverData=' + jsonString
}).then(function successCallback(response) {
	debugger;
	alert(response);
    // this callback will be called asynchronously
    // when the response is available
  }, function errorCallback(response) {
	  debugger;
	alert(response);
    // called asynchronously if an error occurs
    // or server returns response with an error status.
  });*/
  
};
////////////////////////
$scope.encryptclearForm = function (){
	 	$scope.Sourceinstances = '';
		$scope.Sourcedb = '';
		$scope.Sourcetable = '';
		$scope.Targetinstances = '';
		$scope.Targetdb = '';
		$scope.targetObject = '';
		$scope.TargetLoad = '';
		$scope.getablecoulmn = [];
}
			

});
// end of the FormatPreservingEncryptionCtrl

app.controller('BICapabilitiesCtrl', function($scope, $compile, $http, ngDialog) {
  //console.log('inside BICapabilitiesCtrl controller');
	        $scope.hidetrans = function(){
				$scope.universityStudents = false;
				$scope.skillMatching = false;
				$scope.locatorSlide = false;
				$scope.paymentsSlide = false;
				$scope.otherCustmrSlide = false;
			}
       //     $scope.openStudents = function () {
//				$scope.universityStudents = true;
//				$scope.locatorSlide = false;
//				$scope.paymentsSlide = false;
//				$scope.otherCustmrSlide = false
//            };
			 $scope.openSkill = function () {
				$scope.skillMatching = true;
				$scope.locatorSlide = false;
				$scope.paymentsSlide = false;
				$scope.otherCustmrSlide = false
            };
			$scope.openLocation = function () {
				//$scope.universityStudents = false;
				$scope.skillMatching = true;
				$scope.locatorSlide = true;
				$scope.paymentsSlide = false;
				$scope.otherCustmrSlide = false;
            };
			$scope.openPayments = function () {
				//$scope.universityStudents = false;
				$scope.skillMatching = true;
				$scope.locatorSlide = false;
				$scope.paymentsSlide = true;
				$scope.otherCustmrSlide = false;
            };
			$scope.openOthers = function () {
				//$scope.universityStudents = false;
				$scope.skillMatching = true;
				$scope.locatorSlide = false;
				$scope.paymentSlide = false;
				$scope.otherCustmrSlide = true;
            };
}); 
app.animation('.slide-animation', function () {
        return {
            beforeAddClass: function (element, className, done) {
                var scope = element.scope();

                if (className == 'ng-hide') {
                    var finishPoint = element.parent().width();
                    if(scope.direction !== 'right') {
                        finishPoint = -finishPoint;
                    }
                    TweenMax.to(element, 0.5, {left: finishPoint, onComplete: done });
                }
                else {
                    done();
                }
            },
            removeClass: function (element, className, done) {
                var scope = element.scope();

                if (className == 'ng-hide') {
                    element.removeClass('ng-hide');

                    var startPoint = element.parent().width();
                    if(scope.direction === 'right') {
                        startPoint = -startPoint;
                    }

                    TweenMax.fromTo(element, 0.5, { left: startPoint }, {left: 0, onComplete: done });
                }
                else {
                    done();
                }
            }
        };
    });
app.controller('universityStudentsCntrl', function ($scope) {
	 $scope.students = [
{image: 'images/UniversityAndStudents/HoursEarnedPerHour.jpg', 						description: 'Image 00'},
            {image: 'images/UniversityAndStudents/Male_to_Female_Ratio.jpg', 		description: 'Image 01'},
            {image: 'images/UniversityAndStudents/OriginCounty.jpg', 				description: 'Image 02'},
            {image: 'images/UniversityAndStudents/RetensionRisk.jpg', 				description: 'Image 03'},
            {image: 'images/UniversityAndStudents/StudentGPA_PerTerm.jpg', 			description: 'Image 04'},
			{image: 'images/UniversityAndStudents/StudentPerTermByCollege.jpg', 	description: 'Image 05'},
			{image: 'images/UniversityAndStudents/StudentsPerTerm.jpg', 			description: 'Image 06'},
			{image: 'images/UniversityAndStudents/TotalStudentsPerTermByLevel.jpg', description: 'Image 06'}
        ];
     $scope.direction = 'left';
        $scope.currentIndex = 0;

        $scope.setCurrentSlideIndex = function (index) {
            $scope.direction = (index > $scope.currentIndex) ? 'left' : 'right';
            $scope.currentIndex = index;
        };

        $scope.isCurrentSlideIndex = function (index) {
            return $scope.currentIndex === index;
        };
		
	    $scope.prevSlide = function () {
            $scope.direction = 'left';
            $scope.currentIndex = ($scope.currentIndex < $scope.students.length - 1) ? ++$scope.currentIndex : 0;
        };

        $scope.nextSlide = function () {
            $scope.direction = 'right';
            $scope.currentIndex = ($scope.currentIndex > 0) ? --$scope.currentIndex : $scope.students.length - 1;

        };
});

app.controller('skillMatchingCntrl', function ($scope) {
	$scope.skills = [
            {image: 'images/SkillMatching/Skill-Matching.jpg', description: 'Image 00'},
            {image: 'images/SkillMatching/Skill-Matching_2.jpg', description: 'Image 01'},
        ];
     $scope.direction = 'left';
        $scope.currentIndex = 0;

        $scope.setCurrentSlideIndex = function (index) {
            $scope.direction = (index > $scope.currentIndex) ? 'left' : 'right';
            $scope.currentIndex = index;
        };

        $scope.isCurrentSlideIndex = function (index) {
            return $scope.currentIndex === index;
        };
		
	    $scope.prevSlide = function () {
            $scope.direction = 'left';
            $scope.currentIndex = ($scope.currentIndex < $scope.skills.length - 1) ? ++$scope.currentIndex : 0;
        };

        $scope.nextSlide = function () {
            $scope.direction = 'right';
            $scope.currentIndex = ($scope.currentIndex > 0) ? --$scope.currentIndex : $scope.skills.length - 1;
        };
});

app.controller('locationCntrl', function ($scope) {
	$scope.location = [
            {image: 'images/Location/ByCustomerLocation.jpg', description: 'Image 00'},
            {image: 'images/Location/PaymentLocation.jpg', description: 'Image 01'},
            {image: 'images/Location/PaymentLocationWithoutAmount.jpg', description: 'Image 02'},
        ];
     $scope.direction = 'left';
        $scope.currentIndex = 0;

        $scope.setCurrentSlideIndex = function (index) {
            $scope.direction = (index > $scope.currentIndex) ? 'left' : 'right';
            $scope.currentIndex = index;
        };

        $scope.isCurrentSlideIndex = function (index) {
            return $scope.currentIndex === index;
        };
		
	    $scope.prevSlide = function () {
            $scope.direction = 'left';
            $scope.currentIndex = ($scope.currentIndex < $scope.location.length - 1) ? ++$scope.currentIndex : 0;
        };

        $scope.nextSlide = function () {
            $scope.direction = 'right';
            $scope.currentIndex = ($scope.currentIndex > 0) ? --$scope.currentIndex : $scope.location.length - 1;
        };
});
app.controller('paymentsCntrl', function ($scope) {
	$scope.payment = [
            {image: 'images/Payment/ByPaymentByRetailer.jpg', description: 'Image 00'},
            {image: 'images/Payment/ByPaymentType.jpg', description: 'Image 01'},
            {image: 'images/Payment/ByProductByPaymentType.jpg', description: 'Image 02'},
            {image: 'images/Payment/ByProductByPaymentTypeWithoutLabels.jpg', description: 'Image 03'},
            {image: 'images/Payment/YearByPayment.jpg', description: 'Image 04'}
        ];
     $scope.direction = 'left';
        $scope.currentIndex = 0;

        $scope.setCurrentSlideIndex = function (index) {
            $scope.direction = (index > $scope.currentIndex) ? 'left' : 'right';
            $scope.currentIndex = index;
        };

        $scope.isCurrentSlideIndex = function (index) {
            return $scope.currentIndex === index;
        };
		
	    $scope.prevSlide = function () {
            $scope.direction = 'left';
            $scope.currentIndex = ($scope.currentIndex < $scope.payment.length - 1) ? ++$scope.currentIndex : 0;
        };

        $scope.nextSlide = function () {
            $scope.direction = 'right';
            $scope.currentIndex = ($scope.currentIndex > 0) ? --$scope.currentIndex : $scope.payment.length - 1;
        };
});
app.controller('otherCustmrCntrl', function ($scope) {
	$scope.othercustmr = [
            {image: 'images/Others/ByUsage.jpg', description: 'Image 00'},
            {image: 'images/Others/CreditCardUsage.jpg', description: 'Image 01'},
        ];
     $scope.direction = 'left';
        $scope.currentIndex = 0;

        $scope.setCurrentSlideIndex = function (index) {
            $scope.direction = (index > $scope.currentIndex) ? 'left' : 'right';
            $scope.currentIndex = index;
        };

        $scope.isCurrentSlideIndex = function (index) {
            return $scope.currentIndex === index;
        };
		
	    $scope.prevSlide = function () {
            $scope.direction = 'left';
            $scope.currentIndex = ($scope.currentIndex < $scope.othercustmr.length - 1) ? ++$scope.currentIndex : 0;
        };

        $scope.nextSlide = function () {
            $scope.direction = 'right';
            $scope.currentIndex = ($scope.currentIndex > 0) ? --$scope.currentIndex : $scope.othercustmr.length - 1;
        };
});/// BI Capabilities end

app.controller('TabsCtrl', ['$scope', function ($scope) {
    $scope.tabs = [{
            title: 'Import Existing Structure',
            url: 'one.tpl.html'
        }, {
            title: 'Create New Structure',
            url: 'two.tpl.html'
        }];

    $scope.currentTab = 'one.tpl.html';

    $scope.onClickTab = function (tab) {
        $scope.currentTab = tab.url;
    }
    
    $scope.isActiveTab = function(tabUrl) {
        return tabUrl == $scope.currentTab;
    }

   

}]);
app.controller('appController',['$scope',function($scope){
		$scope.$on('LOAD',function(){$scope.loading=true});
		$scope.$on('UNLOAD',function(){$scope.loading=false});
}]);

//////////////// RegisterSourcesCtrl ////////////////////////////////////////
app.controller('RegisterSourcesCtrl', function($scope, $compile, $http, mbScrollbar, ngDialog) {
	  //console.log('inside BICapabilitiesCtrl controller');
/*	// $http.get(leftmenu+"/js/menus.json").then(function(response) {
	  //alert(response);serviceurl
	   $http.get(serviceurl+"/getInstancesDbsTablesCols").success(function(response) {
		   alert(response);
		    var jsonString= JSON.stringify(response);
	  $scope.Menus=jsonString.Menus;
	  
	  //$scope.Menus=response.Menus;
	  console.log(jsonString);
       // $scope.myData = response.data.records;
    });*/
	
	
	$http({
	method: 'GET',
	headers: {
        'Content-type': 'application/json'
    },
	url: serviceurl+'/getInstancesDbsTablesCols',
	//responseType:'json'
	})
	.success(function(response)
	{
		console.log(response);
		$scope.Menus=response.Menus;
	});
	//////////////
	//$scope.$emit('LOAD');
  $http.get(serviceurl+"/getSOURCES")
    .success(function (data)
	 {
		 
		 //alert(data);
		 $scope.names = data;
		// $scope.targetnames = data;
		 $scope.$emit('UNLOAD');
		 }
	 
	 ); 
var BaseController = function($scope) {
     var config = {};
    $scope.scrollbar = function(direction, autoResize, show) {
        config.direction = direction;
        config.autoResize = autoResize;
        config.scrollbar = {
            show: !!show
        };
        return config;
    }
};
new BaseController($scope);

 // mbScrollbar.recalculate($scope);
   mbScrollbar.recalculate($scope);
	
	
  $scope.registerInstances = function(){
	  
	  if(!$scope.instanceType || !$scope.instanceName || !$scope.hostIpAddress || !$scope.portNumber || !$scope.urlPath || !$scope.authType || !$scope.userId || !$scope.password || !$scope.driverName){
		  ngDialog.openConfirm({
                    template: '<p>All fields are mandatory</p><div class="ngdialog-buttons"><button type="button" class="ngdialog-button ngdialog-button-primary" ng-click="confirm(1)">OK</button></div>',
                     plain: true,
                     className: 'ngdialog-theme-default'
                });
   	return false;
	  }
	  var obj = new Object();
  	obj.TYPE_OF_INSTANCE = $scope.instanceType;
	obj.AUTH_TYPE  = $scope.authType;
	obj.SOURCE_INSTANCE = $scope.instanceName;
	obj.USER_ID = $scope.userId;
	obj.HOST_IP_ADDR = $scope.hostIpAddress;
	obj.PASSWD = $scope.password;
	obj.PORT_NUMBER = $scope.portNumber;
	obj.DRIVER_NAME = $scope.driverName;
	obj.URL_PATH = $scope.urlPath;
   var jsonString= JSON.stringify(obj);
   alert(jsonString);
   console.log(jsonString);
   $http({
	method: 'POST',
	headers: {
        'Content-type': 'application/json'
    },
	url: serviceurl+'/saveRegisterInsJsonToDB?serverData=' + jsonString,
	responseType:'json/xml'
	})
	.success(function(response)
	{
		debugger;
		console.log(response);
		//alert(response);
		
		var resp = response;		
		if(resp.Status == 0 ){
			respText = "Successfully Registered!";
		}else{
			respText = "Failed to Register";
		}
		ngDialog.openConfirm({
                    template: '<p>'+respText+'</p><div class="ngdialog-buttons"><button type="button" class="ngdialog-button ngdialog-button-primary" ng-click="confirm(1)">OK</button></div>',
                     plain: true,
                     className: 'ngdialog-theme-default'
                });
		$scope.$emit('UNLOAD');
	})
	.error(function(response)
	{
		debugger;
		//alert(response);
		//alert("Problem with Registration !! ");
		ngDialog.openConfirm({
                    template: '<p>Problem with Registration !!</p><div class="ngdialog-buttons"><button type="button" class="ngdialog-button ngdialog-button-primary" ng-click="confirm(1)">OK</button></div>',
                     plain: true,
                     className: 'ngdialog-theme-default'
                });
		$scope.$emit('UNLOAD');		
		
	});
  }
  
  //////////////// SOR Tab ////////////////////////
  
  $scope.registerSOR = function (){
	  if(!$scope.sorName || !$scope.sorDescription || !$scope.sorOwner || !$scope.sorActive || !$scope.sorCode){
		  ngDialog.openConfirm({
                    template: '<p>All fields are mandatory</p><div class="ngdialog-buttons"><button type="button" class="ngdialog-button ngdialog-button-primary" ng-click="confirm(1)">OK</button></div>',
                     plain: true,
                     className: 'ngdialog-theme-default'
                });
   	return false;
	  }
	  var obj = new Object();
	obj.SOR_NAME = $scope.sorName;
	obj.SOR_CODE  = $scope.sorCode;
	obj.SOR_DESCRIPTION = $scope.sorDescription;
	obj.SOR_OWNER = $scope.sorOwner;
	obj.SOR_ACTIVE_IND = $scope.sorActive;
   var jsonString= JSON.stringify(obj);
   alert(jsonString);
   console.log(jsonString);
   $http({
	method: 'POST',
	headers: {
        'Content-type': 'application/json'
    },
	url: serviceurl+'/SOR_Registration?serverData=' + jsonString,
	responseType:'json/xml'
	})
	.success(function(response)
	{
		debugger;
		console.log(response);
		//alert("success");
        var resp = response;		
		if(resp.Status == 0 ){
			respText = "Successfully Registered!";
		}else{
			respText = "Failed to Register";
		}
		ngDialog.openConfirm({
                    template: '<p>'+respText+'</p><div class="ngdialog-buttons"><button type="button" class="ngdialog-button ngdialog-button-primary" ng-click="confirm(1)">OK</button></div>',
                     plain: true,
                     className: 'ngdialog-theme-default'
                });
		$scope.$emit('UNLOAD');
	})
	.error(function(response)
	{
		debugger;
		alert("fail");
       // alert(JSON.stringify(response)); 
	   ngDialog.openConfirm({
                    template: '<p>Failure</p><div class="ngdialog-buttons"><button type="button" class="ngdialog-button ngdialog-button-primary" ng-click="confirm(1)">OK</button></div>',
                     plain: true,
                     className: 'ngdialog-theme-default'
                });
		$scope.$emit('UNLOAD');		
		
	});
  }

/////////////////////// Register Files Tab///////////////////////
$scope.rigisterfile = function () {
	if(!$scope.sorNameReg || !$scope.delimiter || !$scope.frequency || !$scope.typeofInstance || !$scope.fileLayout || !$scope.tokenName || !$scope.RegFiletype || !$scope.filePath || !$scope.fileName){
		  ngDialog.openConfirm({
                    template: '<p>All fields are mandatory</p><div class="ngdialog-buttons"><button type="button" class="ngdialog-button ngdialog-button-primary" ng-click="confirm(1)">OK</button></div>',
                     plain: true,
                     className: 'ngdialog-theme-default'
                });
   	return false;
	  }
	var obj = new Object();
	obj.SOR_NAME = $scope.sorNameReg;
	obj.FILE_NAME  = $scope.fileName;
	obj.FILE_TYPE  = $scope.RegFiletype;
	obj.FILE_DELIMITER = $scope.delimiter;
	obj.FILE_LAYOUT = $scope.fileLayout;
	obj.FILE_PATH = $scope.filePath;
	obj.FILE_FREQUENCY = $scope.frequency;
	obj.TOKEN_NAME = $scope.tokenName;
	obj.SOURCE_INSTANCE = $scope.typeofInstance;
   var jsonString= JSON.stringify(obj);
   alert(jsonString);
   $http({
	method: 'POST',
	headers: {
        'Content-type': 'application/json'
    },
	url: serviceurl+'/registerFile?serverData=' + jsonString,
	responseType:'json'
	})
	.success(function(response)
	{
		debugger;
		console.log(response);
		//alert("success");
var resp = response;		
		if(resp.Status == 0 ){
			respText = "Successfully Registered!";
		}else{
			respText = "Failed to Register";
		}
		ngDialog.openConfirm({
                    template: '<p>'+respText+'</p><div class="ngdialog-buttons"><button type="button" class="ngdialog-button ngdialog-button-primary" ng-click="confirm(1)">OK</button></div>',
                     plain: true,
                     className: 'ngdialog-theme-default'
                });
		$scope.$emit('UNLOAD');
	})
	.error(function(response)
	{
		debugger;
		//alert("fail");
       // alert(JSON.stringify(response)); 
	   ngDialog.openConfirm({
                    template: '<p>Failure</p><div class="ngdialog-buttons"><button type="button" class="ngdialog-button ngdialog-button-primary" ng-click="confirm(1)">OK</button></div>',
                     plain: true,
                     className: 'ngdialog-theme-default'
                });
		$scope.$emit('UNLOAD');		
		
	});
}

////////////////// Register Table Tab ////////////////////////
$scope.registerTable = function (){
	if(!$scope.Instancefortable || !$scope.tableName || !$scope.DBname){
		  ngDialog.openConfirm({
                    template: '<p>All fields are mandatory</p><div class="ngdialog-buttons"><button type="button" class="ngdialog-button ngdialog-button-primary" ng-click="confirm(1)">OK</button></div>',
                     plain: true,
                     className: 'ngdialog-theme-default'
                });
   	return false;
	  }
	var obj = new Object();
	obj.INSTANCE_NAME = $scope.Instancefortable;
	obj.DB_NAME  = $scope.DBname;
	obj.TABLE_NAME = $scope.tableName;
	obj.FILE_SUB_TYPE = "";
   var jsonString= JSON.stringify(obj);
   alert(jsonString);	
   $http({
	method: 'POST',
	headers: {
        'Content-type': 'application/json'
    },
	url: serviceurl+'/tableRegistration?serverData=' + jsonString,
	responseType:'json'
	})
	.success(function(response)
	{
		debugger;
		console.log(response);
		//alert("success");
var resp = response;		
		if(resp.Status == 0 ){
			respText = "Successfully Registered!";
		}else{
			respText = "Failed to Register";
		}
		ngDialog.openConfirm({
                    template: '<p>'+respText+'</p><div class="ngdialog-buttons"><button type="button" class="ngdialog-button ngdialog-button-primary" ng-click="confirm(1)">OK</button></div>',
                     plain: true,
                     className: 'ngdialog-theme-default'
                });
		$scope.$emit('UNLOAD');
	})
	.error(function(response)
	{
		debugger;
		//alert("fail");
       // alert(JSON.stringify(response)); 
	   ngDialog.openConfirm({
                    template: '<p>Failure</p><div class="ngdialog-buttons"><button type="button" class="ngdialog-button ngdialog-button-primary" ng-click="confirm(1)">OK</button></div>',
                     plain: true,
                     className: 'ngdialog-theme-default'
                });
		$scope.$emit('UNLOAD');		
		
	});
}

}); //// Register sources ctrl End
var ownerarray = [];
var ownercnt = [];
///////////// DashboardCtrl /////////////////////////////////////////
app.controller('DashboardCtrl', function($scope, $http, $compile, ngDialog, $interval, $cookieStore, $timeout, filterFilter) {
$scope.$emit('LOAD');	
$http({
	method: 'GET',
	headers: {
        'Content-type': 'application/json'
    },
	url: serviceurl+'/getRunStat?serverData={"JobName":"","Owner":"","JobFreq":"","JobStatus":"","Startdate":"","Enddate":""}',
	responseType:'json'
	})
    .success(function (data)
	 {		 
		// alert(data);
		 console.log(data);
		 debugger;
		$scope.dashnames = data;
		/////////////////////////////////
		
angular.forEach($scope.dashnames, function(value) {
    if (ownerarray.indexOf(value.Owner) === -1) {
        this.push(value.Owner);
    }
}, ownerarray);
console.log("log is "+ownerarray);
		////////////////////////////////
		$scope.successCnt = getCount('success');
  		$scope.FailedCnt = getCount('Failed');
		$scope.RunningCnt = getCount('Running');
		$scope.TotalCnt = $scope.dashnames.length;
		//$scope.successCntMonth = getCountMonth('success');
	
		angular.forEach(ownerarray, function(value) {
		var owcnt = getCountOwner(value);
		if(!owcnt){
			owcnt = 0;
		}
		this.push(owcnt);
		}, ownercnt);
		
		console.log(ownercnt);
		
		debugger;
		$scope.successinjectedObject = {totalcnt:$scope.TotalCnt, count:$scope.successCnt};
		$scope.failinjectedObject = {totalcnt:$scope.TotalCnt, count:$scope.FailedCnt};
		$scope.runninginjectedObject = {totalcnt:$scope.TotalCnt, count:$scope.RunningCnt};

		$scope.$emit('UNLOAD');	
		 });
/////////// **************** reload table *************** ////////////////////
   $scope.reloadTable = function () {
  $http({
	method: 'GET',
	headers: {
        'Content-type': 'application/json'
    },
	url: serviceurl+'/getRunStat?serverData={"JobName":"","Owner":"","JobFreq":"","JobStatus":"","Startdate":"","Enddate":""}',
	responseType:'json'
	//data: jsonString
	})
    .success(function (data)
	 {		 
		// alert(data.length);
		// console.log(data);
		 debugger;
		 $scope.dashnames = data;
		 // $scope.dashnames.push(data);
		 });
   }
   /////////// **************** reload table function end *************** ////////////////////
   	$scope.reloadTable();
	var reld = $interval($scope.reloadTable, 10000); 
	
/////////// **************** reload table end *************** ////////////////////
$scope.category= '';	 
$scope.$watch('category', function(value) {
       console.log(value);
       //alert(value);
	   $scope.successCntFreq = getCountFreq('success', value);
	   $scope.failedCntFreq = getCountFreq('Failed', value);
	   $scope.runningCntFreq = getCountFreq('Running', value);
	   $scope.successCnt = $scope.successCntFreq;
  	   $scope.FailedCnt = $scope.failedCntFreq;
	   $scope.RunningCnt = $scope.runningCntFreq;
	   $scope.TotalCnt = $scope.successCnt+$scope.FailedCnt+$scope.RunningCnt;
	   //if(value == "Yearly"){
	   $scope.successinjectedObject = {totalcnt:$scope.TotalCnt, count:$scope.successCntFreq};
	   $scope.failinjectedObject = {totalcnt:$scope.TotalCnt, count:$scope.failedCntFreq};
	   $scope.runninginjectedObject = {totalcnt:$scope.TotalCnt, count:$scope.runningCntFreq};
	   //}

    });
///////////////////////////// search function //////////////////////
$scope.searchSubmit = function (){
	debugger;
	$interval.cancel(reld);
	$scope.$emit('UNLOAD');
	var jsonObject = new Object();
		jsonObject.JobName = $scope.searchJobname;		
		jsonObject.Owner = $scope.searchOwner;
		jsonObject.JobFreq = $scope.searchJobFreq;
		jsonObject.JobStatus = $scope.searchJobStatus;
		jsonObject.Startdate = $scope.startDate;
		jsonObject.Enddate = $scope.endDate;
		if(!jsonObject.JobName){
			jsonObject.JobName = " ";		
		}
		if(!jsonObject.Owner){
			jsonObject.Owner = " ";		
		}
		if(!jsonObject.JobFreq){
			jsonObject.JobFreq = " ";		
		}
		if(!jsonObject.JobStatus){
			jsonObject.JobStatus = " ";		
		}
		if(!jsonObject.Startdate){
			jsonObject.Startdate = " ";		
		}
		if(!jsonObject.Enddate){
			jsonObject.Enddate = " ";		
		}
		/*if(!jsonObject.JobName || !jsonObject.Owner || !jsonObject.JobFreq || !jsonObject.JobStatus || !jsonObject.Startdate || !jsonObject.Enddate ){
			
			ngDialog.openConfirm({
                    template: '<p>All fields are mandatory</p><div class="ngdialog-buttons"><button type="button" class="ngdialog-button ngdialog-button-primary" ng-click="confirm(1)">OK</button></div>',
                     plain: true,
                     className: 'ngdialog-theme-default'
                });
   	return false;
		}*/
		if(jsonObject.Enddate < jsonObject.Startdate ){
		//alert("End date should be greater than Start date");	
		ngDialog.openConfirm({
                    template: '<p>End date should be greater than Start date</p><div class="ngdialog-buttons"><button type="button" class="ngdialog-button ngdialog-button-primary" ng-click="confirm(1)">OK</button></div>',
                     plain: true,
                     className: 'ngdialog-theme-default'
                });
		return false;
		}
		var jsonString = JSON.stringify(jsonObject);
		alert(jsonString);
		$scope.$emit('LOAD');
		$http({
	method: 'GET',
	headers: {
        'Content-type': 'application/json'
    },
	url: serviceurl+'/getRunStat?serverData='+jsonString,
	responseType:'json'
	//data: jsonString
	})
    .success(function (data)
	 {		 
		// alert(data);
		 console.log(data);
		
		 debugger;
		 $scope.dashnames = data;
		$scope.successCnt = getCount('success');
  		$scope.FailedCnt = getCount('Failed');
		$scope.RunningCnt = getCount('Running');
		$scope.TotalCnt = $scope.dashnames.length;
		$scope.successCntMonth = getCountFreq('success');
		$scope.failedCntMonth = getCountFreq('Failed');
		$scope.runningCntMonth = getCountFreq('Running');
		$scope.$emit('UNLOAD');
		debugger;
		$scope.successinjectedObject = {totalcnt:$scope.TotalCnt, count:$scope.successCnt};
		$scope.failinjectedObject = {totalcnt:$scope.TotalCnt, count:$scope.FailedCnt};
		$scope.runninginjectedObject = {totalcnt:$scope.TotalCnt, count:$scope.RunningCnt};
		//$scope.ownerinjectedObject = {};
		
		 })
		 .error(function(data)
		 {
			//alert(data);
			ngDialog.openConfirm({
                    template: '<p>Search Failed</p><div class="ngdialog-buttons"><button type="button" class="ngdialog-button ngdialog-button-primary" ng-click="confirm(1)">OK</button></div>',
                     plain: true,
                     className: 'ngdialog-theme-default'
                });
			//alert("Search Failed"); 
			$scope.$emit('UNLOAD');
		 });
}


  function getCount(strCat){
	  debugger;
    return filterFilter( $scope.dashnames, {JobStatus:strCat}).length;
  }
	
/*  function getCountMonth(strCat, freq){
	  debugger;
    return filterFilter( $scope.dashnames, {JobStatus:strCat, JobFreq:freq}).length;
  }*/
  
    function getCountFreq(strCat, freq){
	  debugger;
    return filterFilter( $scope.dashnames, {JobStatus:strCat, JobFreq:freq}).length;
  }
  
  function getCountOwner(strCat){
	  debugger;
    return filterFilter( $scope.dashnames, {Owner:strCat}).length;
  }
	
	$scope.bartbl = true;
		$scope.bartblbg = true;
	
	
	$scope.fullscreenbar = function (){
		$scope.bartbl = false;
		$scope.bartblbg = false;	
	}
		$scope.fullscreenbarCancel = function (){
		$scope.bartbl = true;
		$scope.bartblbg = true;	
	}
	
}); ///////////////// DashboardCtrl End //////////////////////////////
/////////////////////////Register Sources Tabs Menu///////////////////////////////

app.controller('RegTabsCtrl', ['$scope', function ($scope) {
    $scope.Regtabs = [{
            title: 'Register Instance',
            url: 'Register_Instance.tpl.html'
        }, {
            title: 'Register SOR',
            url: 'Register_SOR.tpl.html'
        }, {
            title: 'Register Files',
            url: 'Register_Files.tpl.html'
		}, {
            title: 'Register Tables',
            url: 'Register_Tables.tpl.html'			
    }];

    $scope.currentTab = 'Register_Instance.tpl.html';

    $scope.onClickTab = function (tab) {
        $scope.currentTab = tab.url;
    }
    
    $scope.isActiveTab = function(tabUrl) {
        return tabUrl == $scope.currentTab;
    }
}]);
app.directive('sourceInstances', function() {
  return {
    restrict: 'EA',
    template: '<select ng-model="Sourceinstances" ng-change="GetSourcetable(Sourceinstances)" ng-options="instances for instances in names"></select>',
	controller: function($scope, $http) {
      $http.get(serviceurl+"/getSOURCES")
    .success(function (data)
	 {
		 
		 //alert(data);
		 $scope.names = data;
		 $scope.targetnames = data;
		 $scope.$emit('UNLOAD');
		 }
	 
	 );
  }
  
}
});
app.controller('OtherController', ['$scope', function ($scope) {
	
/*	$scope.pageChangeHandler = function(num) {
    console.log('going to page ' + num);
  };*/
}]);
  
  
var circleLenght = '';  
  
  
app.directive('successDirective', function () {
    return {
        restrict: 'E',
        scope: {
        /*The object that passed from the cntroller*/
        successobjectToInject: '=',
        },
        template: '<div class="col-sm-4" id="doughnut-chart"><div class="panel panel-default"><div class="panel-heading">Success</div><div class="panel-body"><canvas id="doughnut" class="chart chart-doughnut chart-xs" chart-data="data"                     chart-labels="labels" chart-colours="colours" chart-legend="false"></canvas></div></div></div>',

        link: function ($scope, element, attrs, $timeout) {
			$scope.$watch('successobjectToInject', function (value) {
				debugger;		
		$scope.labels = ['Successfull Job Count', 'Failed & Running Job Cnt'];
		$scope.colours = ['#54c154', '#eeeeee'];
		var successCount = value.count;
		var totalCount = value.totalcnt;
		circleLenght = totalCount - successCount;
   		$scope.data = [successCount, circleLenght];
	//console.log(value.count);		
			})
		}
	}
    
});

app.directive('failDirective', function () {
    return {
        restrict: 'E',
        scope: {
        /*The object that passed from the cntroller*/
        failobjectToInject: '=',
        },
        template: '<div class="col-sm-4" id="doughnut-chart"><div class="panel panel-default"><div class="panel-heading failed">Failed</div><div class="panel-body"><canvas id="doughnut" class="chart chart-doughnut chart-xs" chart-data="data"                     chart-labels="labels" chart-colours="colours" chart-legend="false"></canvas></div></div></div>',

        link: function ($scope, element, attrs, $timeout) {
			$scope.$watch('failobjectToInject', function (value) {
				debugger;		
		$scope.labels = ['Failed Job Count', 'Successfull & Running Job Cnt'];
		$scope.colours = ['#ca3636', '#eeeeee'];
		var failCount = value.count;
		var totalCount = value.totalcnt;
		circleLenght = totalCount - failCount;
   		$scope.data = [failCount, circleLenght];
	//console.log(value.count);
		
			})
		}
	}
    
});

app.directive('runningDirective', function () {
    return {
        restrict: 'E',
        scope: {
        /*The object that passed from the cntroller*/
        runningobjectToInject: '=',
        },
        template: '<div class="col-sm-4" id="doughnut-chart"><div class="panel panel-default"><div class="panel-heading">Running</div><div class="panel-body"><canvas id="doughnut" class="chart chart-doughnut chart-xs" chart-data="data" chart-labels="labels" chart-colours="colours" chart-legend="false"></canvas></div></div></div>',

        link: function ($scope, element, attrs, $timeout) {
			$scope.$watch('runningobjectToInject', function (value) {
				debugger;		
		$scope.labels = ['Running Job Count', 'Successfull & Failed Job Cnt'];
		$scope.colours = ['#0076bf', '#eeeeee'];
		var runningCount = value.count;
		var totalCount = value.totalcnt;
		circleLenght = totalCount - runningCount;
		$scope.data = [runningCount, circleLenght];
   	//console.log(value.count);
		
			})
		}
	}
    
});

app.directive('ownerDirective', function () {
    return {
        restrict: 'E',
        scope: {
        /*The object that passed from the cntroller*/
        ownerobjectToInject: '=',
        },
        template: '<div id="bar-chart"><div class="panel panel-default panel-owner"><div class="panel-heading">Owner Stats</div><div class="panel-body"><canvas id="bar" class="chart chart-bar" data="data" labels="labels" chart-colours="colours"></canvas></div></div></div>',

        link: function ($scope, element, attrs, $timeout) {
			$scope.$watch('ownerobjectToInject', function (value) {
				debugger;		//ownerarray ownercnt
		//$scope.labels = ['HDFC', 'JAVA', 'JDBC', 'BLK DM', 'TDM'];
		$scope.labels = ownerarray;
		$scope.series = ['Series A'];
/*  $scope.data = [
    [value.HDFScount, value.JAVAcount, value.JDBCcount, value.BLKDMcount, value.TDMcount]
  ];*/
  $scope.data = [ownercnt];
		$scope.colours = [{
		"fillColor": "rgba(224, 108, 112, 1)",
          "strokeColor": "rgba(207,100,103,1)"
		
		}];		
			})
		}
	}
    
});
