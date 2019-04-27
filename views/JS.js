
var value = 0;
var app = angular.module("myApp1",[]);

app.controller("myCtrl1",function($scope,$http,$interval){
   

  $interval(function(){
    $http.get("/values")
    .then(function(response) {
      //console.log(response.data);
      fg1(response.data );

    });

  },1000);
 
});

app.controller("myCtrl",function($scope,$http,$interval){
   

    $interval(function(){
      $http.get("/tajay/all")
      .then(function(response) {
        console.log(response.data);
        
        console.log(response.data);
      
        $scope.name = response.data.temperature;//parseInt(response.data.temperature);
  
        $scope.heart = response.data.bpm;
        if(response.data.orientation == "BK"){ $scope.orientation = "On Back" ;}
        else if(response.data.orientation == "LS"){ $scope.orientation = "On Leftside" ;}
        else if(response.data.orientation == "RS"){ $scope.orientation = "On Rightside" ;}
        else{$scope.orientation = "On Front"; }
        
         
  
      });
  
  
    },2000);

    
  });



function fg1(req){
  value = req ;}



Highcharts.chart('container1', {
  chart: {
      type: 'spline',
      animation: Highcharts.svg, // don't animate in old IE
      marginRight: 10,
      events: {
          load: function () {

              // set up the updating of the chart each second
              var series = this.series[0];
              setInterval(function () {
                  var x = (new Date()).getTime(), // current time
                      y = value    //Math.random();
                  series.addPoint([x, y], true, true);
              }, 1000);
          }
      }
  },

  time: {
      useUTC: false
  },

  title: {
      text: 'TEMPERATURE READINGS'
  },
  xAxis: {
      type: 'datetime',
      tickPixelInterval: 150
  },
  yAxis: {
      title: {
          text: 'Temperature'
      },
      plotLines: [{
          value: 0,
          width: 1,
          color: '#808080'
      }]
  },
  tooltip: {
      headerFormat: '<b>{series.name}</b><br/>',
      pointFormat: '{point.x:%Y-%m-%d %H:%M:%S}<br/>{point.y:.2f}'
  },
  legend: {
      enabled: false
  },
  exporting: {
      enabled: false
  },
  series: [{
      name: 'data @',
      data: (function () {
          // generate an array of random data
          var data = [],
              time = (new Date()).getTime(),
              i;

          for (i = -19; i <= 0; i += 1) {
              data.push({
                  x: time + i * 1000,
                  y: Math.random()
              });
          }
          return data;
      }())
  }]
}); 



