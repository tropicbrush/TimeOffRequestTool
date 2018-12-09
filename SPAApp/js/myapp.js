window.addEventListener('load', function() {
  function myLeaves() {
          var xhttp = new XMLHttpRequest();
          xhttp.onreadystatechange = function() {
            if (this.readyState == 4){
                if ( this.status == 200) {
                obj = JSON.parse(this.responseText);

                var Table = document.getElementById("myLeavesTab");
                Table.innerHTML = "<tr>  <th>Request ID</th> <th>Username</th>  <th>Start Dt</th> <th>End Dt</th><th>Status</th> <th>Comments</th> <th>Actions</th></tr>";
                var tr;
                for (var i = 0; i < obj.results ; i++) {
                      var buttonVal = '';
                     if (obj.Output[i].status == 'Pending'){ buttonVal ="<button class=\"cancelReq\">Cancel</button><button class=\"editbtn\">Edit</button>";}

                    tr = $("<tr>");
                    tr.append("<td>" + obj.Output[i].id + "</td>");
                    tr.append("<td>" + obj.Output[i].username + "</td>");
                    tr.append("<td class='edit'>" + obj.Output[i].startdt+ "</td>");
                    tr.append("<td class='edit'>" + obj.Output[i].enddt+ "</td>");
                    tr.append("<td>" + obj.Output[i].status+ "</td>");
                    tr.append("<td class='edit'>" + obj.Output[i].comments+ "</td>");
                    tr.append("<td>"+buttonVal+"</td>");
                    $('#myLeavesTab').append(tr);
                }
            }
            else if ( this.status == 405){
                        alert(" Received Alert: Not Authorized ");
                     }
	    else {
		alert("Something went wrong");
		}
                }
          };

          let access_token = sessionStorage.getItem('access_token');
          xhttp.open("POST", AUTH0_AUDIENCE+"/api/v1.0/getMyLeaves", true);
          xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
          xhttp.send('access_token=' + access_token);
        }


  
$(document).ready(function () {
          $("#myLeavesTab").on('click', '.cancelReq', function () {
            var data = new Array();
            var currentTD = $(this).parents('tr').find('td');
              if ($(this).html() == 'Cancel') {
                  currentTD = $(this).parents('tr').find('td');
                  $.each(currentTD, function () {
                        data.push($(this).html());
                     });
if(data[0] != null)
{
var url = AUTH0_AUDIENCE+"/api/v1.0/cancelRequest";
let access_token = sessionStorage.getItem('access_token');
      var posting = $.post( url, { req_id:data[0], access_token:access_token } );

      /* Alerts the results */
      posting.done(function( data ) {
        alert('Leave request cancelled');
        myLeaves();
      });
      /* Alert if Request is not successful */
      posting.fail(function (jqXHR, textStatus, error) {
	var responseText = jQuery.parseJSON(jqXHR.responseText);
        
        alert('Leave reqeust cancellation failed '+ responseText.msg);
       
      });
}
            }
          });

      });


/*Allow logged in user to edit his requestes which are not in Pending status*/
$(document).ready(function () {
          //$(".editbtn").click(function () {
          $("#myLeavesTab").on('click', '.editbtn', function () {
            var data = new Array();
            var currentTD = $(this).parents('tr').find('td');
              if ($(this).html() == 'Edit') {
                  currentTD = $(this).parents('tr').find('td');
                  $.each(currentTD, function () {
                     // alert($(this).html());
                        data.push($(this).html());
                     if ($(this).hasClass("edit")){
                      $(this).prop('contenteditable', true)
                        }
                });
              } else {
                 $.each(currentTD, function () {
                     data.push($(this).html());
                      $(this).prop('contenteditable', false)
                  });
              //alert(data[1]);


if(data[0] != null)
{
var url = AUTH0_AUDIENCE+"/api/v1.0/updateLeaveRequest";
let access_token = sessionStorage.getItem('access_token');
      var posting = $.post( url, { req_id:data[0], startdt: data[2], enddt: data[3],comments: data[5], access_token:access_token } );

      /* Alerts the results */
      posting.done(function( data ) {
        alert('Leave request update succeded');
        myLeaves();
      });
      /* Alert if Request is not successful */
      posting.fail(function (jqXHR, textStatus, error) {
     
	var responseText = jQuery.parseJSON(jqXHR.responseText);
        alert('Leave request update failed : '+ responseText.msg);
      });



}

                }

              $(this).html($(this).html() == 'Edit' ? 'Save' : 'Edit')
          });

      });




/*Form to submit request*/
$("#formoid").submit(function(event) {

      /* stop form from submitting normally */
      event.preventDefault();

      /* get the action attribute from the <form action=""> element */
            var $form = $( this ),
          url = $form.attr( 'action' );

      /* Send the data using post with element id name and name2*/
      let access_token = sessionStorage.getItem('access_token');
      var posting = $.post( url, { startdt: $('#startdt').val(), enddt: $('#enddt').val(),comments: $('#comments').val(), access_token:access_token } );

      /* Alerts the results */
      posting.done(function( data ) {
        alert('Leave reqeust Submitted');
        myLeaves();
      });
      /* Alert if Request is not successful */
      posting.fail(function (jqXHR, textStatus, error) {
	var responseText = jQuery.parseJSON(jqXHR.responseText);
        console.log(responseText.msg);
	alert('Leave reqeust Failed: '+ responseText.msg);
      });
    });

/*get All Requests in Org*/
function allRequests() {
          var xhttp = new XMLHttpRequest();
          xhttp.onreadystatechange = function() {
            if (this.readyState == 4){
                if ( this.status == 200) {
                obj = JSON.parse(this.responseText);

                var Table = document.getElementById("AllReqTab");
                Table.innerHTML = "<tr>  <th>Request ID</th> <th>Username</th>  <th>Start Dt</th> <th>End Dt</th><th>Status</th> <th>Comments</th> <th>Actions</th></tr>";
                var tr;
                for (var i = 0; i < obj.results ; i++) {
                      var buttonVal = '';
                     if (obj.Output[i].status == 'Pending'){ buttonVal ="<button class=\"cancelLeave\">Cancel</button><button class=\"editbtn\">Edit</button><button class=\"approvebtn\">Approve</button>";}

                    tr = $("<tr>");
                    tr.append("<td>" + obj.Output[i].id + "</td>");
                    tr.append("<td>" + obj.Output[i].username + "</td>");
                    tr.append("<td class='edit'>" + obj.Output[i].startdt+ "</td>");
                    tr.append("<td class='edit'>" + obj.Output[i].enddt+ "</td>");
                    tr.append("<td>" + obj.Output[i].status+ "</td>");
                    tr.append("<td class='edit'>" + obj.Output[i].comments+ "</td>");
                    tr.append("<td>"+buttonVal+"</td>");
                    $('#AllReqTab').append(tr);
                }
            }
            else if ( this.status == 404){
                        alert("Error: Not Authorized ");
                     }
            else {alert("Something went wrong");}
                }
          };

          let access_token = sessionStorage.getItem('access_token');
          xhttp.open("POST", AUTH0_AUDIENCE+"/api/v1.0/getAllLeaves", true);
          xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
          xhttp.send('access_token=' + access_token);
        }


$(document).ready(function () {
          $("#AllReqTab").on('click', '.approvebtn', function () {
            var data = new Array();
            var currentTD = $(this).parents('tr').find('td');
              if ($(this).html() == 'Approve') {
                  currentTD = $(this).parents('tr').find('td');
                  $.each(currentTD, function () {
                        data.push($(this).html());
                     });


if(data[0] != null)
{
var url = AUTH0_AUDIENCE+"/api/v1.0/approveRequest";
let access_token = sessionStorage.getItem('access_token');
      var posting = $.post( url, { req_id:data[0], access_token:access_token } );

      /* Alerts the results */
      posting.done(function( data ) {
        alert('Leave request approved');
	allRequests();
      });
      /* Alert if Request is not successful */
      posting.fail(function (jqXHR, textStatus, error) {
      
        var responseText = jQuery.parseJSON(jqXHR.responseText);
        alert('Leave request approval failed : '+ responseText.msg);
      });
}
            }
          });

      });


$(document).ready(function () {
          //$(".editbtn").click(function () {
          $("#AllReqTab").on('click', '.cancelLeave', function () {
            var data = new Array();
            var currentTD = $(this).parents('tr').find('td');
              if ($(this).html() == 'Cancel') {
                  currentTD = $(this).parents('tr').find('td');
                  $.each(currentTD, function () {
                     // alert($(this).html());
                        data.push($(this).html());
                     });


if(data[0] != null)
{
var url = AUTH0_AUDIENCE+"/api/v1.0/cancelRequest";
let access_token = sessionStorage.getItem('access_token');
      var posting = $.post( url, { req_id:data[0], access_token:access_token } );

      /* Alerts the results */
      posting.done(function( data ) {
        alert('Leave request cancelled');
	allRequests();
      });
      /* Alert if Request is not successful */

 posting.fail(function (jqXHR, textStatus, error) {
	var responseText = jQuery.parseJSON(jqXHR.responseText);
        alert('Leave request cancellation failed : '+ responseText.msg);
      });
}
            }
          });

      });


function getDRReq() {
          var xhttp = new XMLHttpRequest();
          xhttp.onreadystatechange = function() {
            if (this.readyState == 4){
                if ( this.status == 200) {
                obj = JSON.parse(this.responseText);

                var Table = document.getElementById("myDRReqTab");
                Table.innerHTML = "<tr>  <th>Request ID</th> <th>Username</th>  <th>Start Dt</th> <th>End Dt</th><th>Status</th> <th>Comments</th> <th>Actions</th></tr>";
                var tr;
                for (var i = 0; i < obj.results ; i++) {
                      var buttonVal = '';
                     if (obj.Output[i].status == 'Pending'){ buttonVal ="<button class=\"approveReq\">Approve</button><button class=\"reject\">Reject</button>";}

                    tr = $("<tr>");
                    tr.append("<td>" + obj.Output[i].id + "</td>");
                    tr.append("<td>" + obj.Output[i].username + "</td>");
                    tr.append("<td class='edit'>" + obj.Output[i].startdt+ "</td>");
                    tr.append("<td class='edit'>" + obj.Output[i].enddt+ "</td>");
                    tr.append("<td>" + obj.Output[i].status+ "</td>");
                    tr.append("<td class='edit'>" + obj.Output[i].comments+ "</td>");
                    tr.append("<td>"+buttonVal+"</td>");
                    $('#myDRReqTab').append(tr);
                }
            }
            else if ( this.status == 404){
                        alert("Error : Unauthorized");
                     }
	    else {alert("Something went wrong");}

                }
          };

          let access_token = sessionStorage.getItem('access_token');
          xhttp.open("POST", AUTH0_AUDIENCE+"/api/v1.0/getDRLeaves", true);
          xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
          xhttp.send('access_token=' + access_token);
        }


$(document).ready(function () {
          //$(".editbtn").click(function () {
          $("#myDRReqTab").on('click', '.approveReq', function () {
            var data = new Array();
            var currentTD = $(this).parents('tr').find('td');
              if ($(this).html() == 'Approve') {
                  currentTD = $(this).parents('tr').find('td');
                  $.each(currentTD, function () {
                     // alert($(this).html());
                        data.push($(this).html());
                     });


if(data[0] != null)
{
var url = AUTH0_AUDIENCE+"/api/v1.0/approveRequest";
let access_token = sessionStorage.getItem('access_token');
      var posting = $.post( url, { req_id:data[0], access_token:access_token } );

      /* Alerts the results */
      posting.done(function( data ) {
        alert('Leave request approved');
        getDRReq();
      });
      /* Alert if Request is not successful */
      posting.fail(function (jqXHR, textStatus, error) {
	var responseText = jQuery.parseJSON(jqXHR.responseText);
        alert('Leave request approve failed : '+ responseText.msg);
      });
}
            }
          });

      });


$(document).ready(function () {
          //$(".editbtn").click(function () {
          $("#myDRReqTab").on('click', '.reject', function () {
            var data = new Array();
            var currentTD = $(this).parents('tr').find('td');
              if ($(this).html() == 'Reject') {
                  currentTD = $(this).parents('tr').find('td');
                  $.each(currentTD, function () {
                     // alert($(this).html());
                        data.push($(this).html());
                     });


if(data[0] != null)
{
var url = AUTH0_AUDIENCE+"/api/v1.0/rejectRequest";
let access_token = sessionStorage.getItem('access_token');
      var posting = $.post( url, { req_id:data[0], access_token:access_token } );

      /* Alerts the results */
      posting.done(function( data ) {
        alert('Leave request rejected');

        getDRReq();
      });
      /* Alert if Request is not successful */
      posting.fail(function (jqXHR, textStatus, error) {
        var responseText = jQuery.parseJSON(jqXHR.responseText);
        alert('Leave request rejection failed : '+ responseText.msg);
      });
}
            }
          });

      });


$(document).ready(function () {
          //$(".editbtn").click(function () {
          $("#AllReqTab").on('click', '.editbtn', function () {
            var data = new Array();
            var currentTD = $(this).parents('tr').find('td');
              if ($(this).html() == 'Edit') {
                  currentTD = $(this).parents('tr').find('td');
                  $.each(currentTD, function () {
                     // alert($(this).html());
                        data.push($(this).html());
                     if ($(this).hasClass("edit")){
                      $(this).prop('contenteditable', true)
                        }
                });
              } else {
                 $.each(currentTD, function () {
                     data.push($(this).html());
                      $(this).prop('contenteditable', false)
                  });
              //alert(data[1]);


if(data[0] != null)
{
var url = AUTH0_AUDIENCE+"/api/v1.0/updateLeaveRequest";
let access_token = sessionStorage.getItem('access_token');
      var posting = $.post( url, { req_id:data[0], startdt: data[2], enddt: data[3],comments: data[5], access_token:access_token } );

      /* Alerts the results */
      posting.done(function( data ) {
        alert('Leave reqeust Submitted');
       allRequests(); 
      });
      /* Alert if Request is not successful */
      posting.fail(function (jqXHR, textStatus, error) {
        var responseText = jQuery.parseJSON(jqXHR.responseText);
        alert('Leave request update failed : '+ responseText.msg);
      });



}

                }

              $(this).html($(this).html() == 'Edit' ? 'Save' : 'Edit')
          });

      });




  var getMyReqBtn = document.getElementById('getMyReq');
  var getMyDRReqBtn = document.getElementById('getMyDRReq');
  var getAllReqBtn = document.getElementById('getAllReq');


  getMyReqBtn.addEventListener('click', myLeaves);
  getMyDRReqBtn.addEventListener('click',getDRReq);
  getAllReqBtn.addEventListener('click',allRequests);




});

