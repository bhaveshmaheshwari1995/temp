// app.js
var app = angular.module('routerApp', ['ui.router']);

app.config(function($stateProvider, $urlRouterProvider,$locationProvider) {

  $urlRouterProvider.otherwise('home');

  $stateProvider

  // HOME STATES AND NESTED VIEWS ========================================
  .state('home', {
    url: '/home',
    templateUrl: '/partial-home.html'
  })
  .state('edit',{
    url:'/profiles/:userid/edit',
    templateUrl:'/edit.html'
  })
  .state('admin',{
    url:'/admin/home',
    templateUrl:'/admin.html'
  })
  // ABOUT PAGE AND MULTIPLE NAMED VIEWS =================================
  .state('dashboard', {
    url: '/profiles/:userid',
    templateUrl: '/view.html'

  })
  //$locationProvider.html5Mode(true);


});
//..controller for resgistration..//
app.controller('RegisterController',function($scope,$http){

    $scope.validateRegister = function() {
      
      if(!($scope.password==null) ) {
        if ($scope.cpass == $scope.password ){
         
          $scope.saveData($scope.email_id,$scope.firstname,$scope.lastname,$scope.password);
        }
        else{
          $scope.message="Password and confirm password does not match";
        }
      }  
   
    //..end of loginuser function.. 

  }


  $scope.saveData=function(email_id,firstname,lastname,password){
    var data = {
        firstname : firstname,
        lastname : lastname,
        password : password,
        email_id : email_id
    };

    $http.post('/register', data)
    .success(function(res) {
      $scope.message=res.message;
      alert(res.message);

    })
    .error(function(data) {
      $scope.message="Error in Register";
    });
  }
});

//Controller for the login of the user
app.controller('LoginController', function($scope,$http, $state) {



    $scope.validate = function() {
    if(!($scope.user_password==null)) {
      $scope.loginUser($scope.user_email,$scope.user_password);
    }  
   
    //..end of loginuser function.. 

  }


  $scope.loginUser = function(email_id,password) {
    var data = {
        emailid :email_id,
        password: password
    };  

    $http.post('/myapi/authenticate',data)
    .success(function(response) {

      localStorage.setItem('token',response.token);
      if(response.success)
      {
        if(response.user.role==1) {
        	if(response.message!="FirstLogin"){
          		$state.go('dashboard',{userid:response.user.email_id});
      		}
      		else {
      			$state.go('edit',{userid:email_id});
      		}
        }
        else if(response.user.role==2) {    
          $state.go('admin');
        }
      }
      else {
        //$scope.message=response.message;
        alert(response.message);
        $state.go('home');
      }
    })
    .error(function(response) {
      alert("err "+response.message);

    });

    //..end of loginuser function.. 

  }

  //...end of the LoginController..

});

app.controller('ViewController',function($scope, $state ,$http, $stateParams) {
  var data = $stateParams;
  $scope.user_details;
  $scope.user_list={};
$scope.user_detail={};
  $scope.imagepath;

  $scope.userid=data.userid;

  $scope.logout = function () {
    localStorage.clear();
    $state.go('home');
  };
  $scope.editProfile = function () {
    $state.go('edit',{userid:data.userid});
  };

  var config = {
    headers: {
      'x-access-token': localStorage.getItem('token'),
      'Accept': 'application/json;odata=verbose',
      "X-Testing" : "testing"
    }
  };

  // Function to perform like operation
  $scope.liked = function (email_id) {
    var data =  {
      email_id: email_id
      
    };
    var sysdate = new Date;
    var c_date = sysdate.getDate()+"-"+(sysdate.getMonth()+1)+"-"+sysdate.getFullYear();
    $scope.user_detail.push({ email_id: email_id, like_date:c_date, _id:""});


    $http.put('/myapi/like/'+$scope.userid,data,config)
    .success(function(response) {
      if(response.success) {
	$scope.user_info=response.data[0].id_liked;
        alert(response.message);

          $http.get('/myapi/getLikedProfiles/'+data.userid,config)
          .success(function(response) {

    if(response.success) {
      $scope.user_info=response.data[0].id_liked;
      //alert(JSON.stringify(response.data[0].id_liked) );
    }
    else {
      alert("Error::"+response.message);   
      $scope.message="There is some error. We will get back to you later";
    }
  })
  .error(function(response){
    alert(response);
    $scope.message=JSON.stringify(response);
  });

      }
      else {
        alert(response.message);
      }
    })
    .error(function(data) {
      alert("Error "+response.message);
    });
  }

  $http.get('/myapi/users/view/'+data.userid,config)
  .success(function(response) {
    if(response.success) {
      $scope.user_data=response.data;
      localStorage.setItem('user_details',JSON.stringify(response.data));

      if($scope.user_data.gender=="male" || $scope.user_data.gender=="Male") {
        $scope.imagepath="images/male_profile_pic.jpg";
        $scope.suggestion_imagepath="images/female_profile_pic.jpg";
      }
      else if($scope.user_data.gender=="female" || $scope.user_data.gender=="Female") {
        $scope.imagepath="images/female_profile_pic.jpg";
        $scope.suggestion_imagepath="images/male_profile_pic.jpg";
      }
      else  {
        $scope.imagepath="images/no_profile_pic.jpg";
      }
    }
    else {
      $scope.message="There is some error. We will get back to you later";
    }
  })
  .error(function(response) {
    $scope.message=JSON.stringify(response);
  });

  $http.get('/myapi/getSuggestion/'+data.userid,config)
  .success(function(response) {

    if(response.success) {
      $scope.user_list=response.data;
    }
    else {
      alert("Error::"+response.message);   
      $scope.message="There is some error. We will get back to you later";
    }
  })
  .error(function(response) {
    $scope.message=JSON.stringify(response);
  });

  $http.get('/myapi/getLikedProfiles/'+data.userid,config)
  .success(function(response) {

    if(response.success) {
      $scope.user_detail=response.data[0].id_liked;
      $scope.userWhoLiked=response.data[0].liked_by;

      //alert(JSON.stringify(response.data[0].id_liked) );
    }
    else {
      alert("Error::"+response.message);   
      $scope.message="There is some error. We will get back to you later";
    }
  })
  .error(function(response){
    alert(response);
    $scope.message=JSON.stringify(response);
  });


  //View Controller ends here
});

//Edit Controller starts here
app.controller('EditController',function($scope, $state ,$http, $stateParams) {
  var parameters = $stateParams;
  $scope.userid  = parameters.userid;
  $scope.user_details = JSON.parse(localStorage.getItem('user_details'));
  $scope.email_id = $scope.user_details.email_id;
  $scope.firstname = $scope.user_details.firstname;
  $scope.lastname = $scope.user_details.lastname;
  $scope.gender = $scope.user_details.gender;
  $scope.dob = $scope.user_details.dob;
  $scope.city = $scope.user_details.city;
  $scope.country = $scope.user_details.country;
  $scope.mobile = $scope.user_details.mobile;

  $scope.gotoHome = function () {
    $state.go('home');
  };

  $scope.back = function () {
    $state.go('dashboard',{userid:$scope.userid});
  };

  $scope.Editform = function () {

    var data = {
        firstname:  $scope.firstname,
        lastname:   $scope.lastname,
        email_id:   $scope.email_id,
        gender  :   $scope.gender.toLowerCase(),
        dob   :   $scope.dob,
        mobile  :   $scope.mobile,
        city  :   $scope.city.toLowerCase(),
        country :   $scope.country.toLowerCase()
    };

    var config = {

        headers:  {
      'x-access-token': localStorage.getItem('token'),
      'Accept': 'application/json;odata=verbose',
      "X-Testing" : "testing"
    }  };

    $http.put('/myapi/edit/'+parameters.userid,data,config)
    .success(function(response) {

      if(response.success)
      {
        $scope.message=response.message;
        $state.go('dashboard',{userid:parameters.userid});
      }
      else
      {
        alert(response.message);
        $scope.message="There is some error. We will get back to you later";
      }
    })
    .error(function(data) {
      alert("error in token"+response.message);
      $scope.message=JSON.stringify(response);


    });
  }
});

//controller for admin actions
app.controller('AdminController',function($scope,$http,$state){
  $scope.user_list={};
  $scope.message="";

  var config = {
    headers: {
      'x-access-token': localStorage.getItem('token'),
      'Accept': 'application/json;odata=verbose',
      "X-Testing" : "testing"
    }
  };

  $http.get('myapi/getTopUser',config)
  .success(function(res) {
    $scope.user_list=res.data;
  })
  .error(function(err) {
    alert('Error: ' + err);
  });

  $scope.logout = function () {
    localStorage.clear();
    $state.go('home');
  }

  $scope.getUserInfo = function () {

    $http.get('/myapi/getLikedProfiles/'+$scope.search,config)
    .success(function(response) {

      if(response.success) {
        if(JSON.stringify(response.data[0].id_liked)=="[]"){
          $scope.message="No profiles liked yet";
          $scope.user_info="";
        }
        else{
          $scope.user_info=response.data[0].id_liked;
          $scope.message="";
        }
      }
      else {
        alert("Error::"+response.message);   
        $scope.message="There is some error. We will get back to you later";
      }
    })
    .error(function(response){
      $scope.message="Wrong email id entered. try again with correct one";
    });
  }
});
