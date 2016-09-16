console.time('RenderData');
function reloadPage() {
  var remote = require('electron').remote
  remote.getCurrentWindow().reload()
}
window.$ = window.jQuery = require('./js/jquery-3.1.0.min.js');
_ = require('lodash');
var request = require('request')
var schule = "Schleswig_Lornsenschule"
var url = "https://api.vertretungsplan.me/" +
  "v2/" +
  "substitutionschedules/" +
  schule + "/" +
  "schulervertretungsplan" +
  "?client=desktop_marcel"

request({
  url: url,
  json: true,
  ttl: 1800000
}, function (error, response, body) {
  console.log("Response Code: " + response.statusCode)
  if (!error && response.statusCode === 200) {
    console.log("Parsing")
    document.all.school.innerHTML = body.schoolId.replace(/_/g, ' ') + ' Vertretungsplan'; // Print the json response
    $("#classes").append('<option>Alle</option>')
    _.find(body.classes, function (key) {
      alle_klassen = key
      _.find(body.days, function (key) {
        substitutions = key["substitutions"]
        _.find(substitutions, function (key) {
          klassen = key["classes"]
          if (_.includes(klassen, alle_klassen)) {
            if ($('#classes option:contains(' + alle_klassen + ')').length == 0) {
              $("#classes").append('<option>' + alle_klassen + '</option>')
            }else{}
          }
        })
      })
    })
    $('#classes option:contains("Alle")').prop('selected',true);
    render()

    _.find(body.days, function (key) {
      date = key["dateString"]
      messages = key["messages"]
      $("#messages").append('<h2 id="date">' + date + '</h2>')
      _.find(messages, function (key) {
        $("#messages").append('<div class="card card-block" style="height: 10%; background-color: #EEEEEE; color: #000"><p>' + key.replace(/\n/g, ' ') + '</p></div>')
      })
    })

    _.find(body.additionalInfos, function (key) {
      InfosTitle = key["title"]
      InfosText = key["text"]
      $("#messages").append('<h2 id="additionalInfos">' + InfosTitle + '</h2>')
      $("#messages").append('<div class="card card-block" style="height: 10%; background-color: #EEEEEE; color: #000"><p>' + InfosText + '</p></div>')
    })

    $("#classes").on('change', function() {
       render()
    })

    function render() {
      console.time('generateDivs');
      _.find(body.days, function (key) {
        date = key["dateString"]
        substitutions = key["substitutions"]
        messages = key["messages"]
        day = key
        selected_class = $( "#classes option:selected" ).text();
        $("div").filter("[day='" + _.indexOf(body.days, day) + "']", "#days").empty();
        $("div").filter("[day='" + _.indexOf(body.days, day) + "']", "#days").append('<h2 id="date" date="' + date + '">' + date + '</h2>')
        _.find(substitutions, function (key) {
          substitutions_now = key
          klassen = substitutions_now["classes"]
          _.find(klassen, function (key) {
            klasse = key
            if ((klasse === selected_class) || (selected_class == "Alle")) {
              if ($("h3").filter("[klasse='" + klasse + "'][day='" + day + "']", "#klasse").length == 0) {
                $("h2").filter("[date='" + date + "']", "#days").after('<div id="klasse" klasse="' + klasse + '"><h3 id="klasse" klasse="' + klasse + '" day="' + day + '">' + klasse + '</h3>')
              }else{}
              var reg = new RegExp('[-]');
              lesson = substitutions_now["lesson"]
              substitutions_type = substitutions_now["type"]
              text = substitutions_now["text"]

              if (substitutions_type == "Vertretung") {
                if (reg.test(lesson)) {
                  $("h3").filter("[klasse='" + klasse + "'][day='" + day + "']", "#klasse").after('<div class="card card-block" style="height: 10%; background-color: #2196F3; color: #fff" id="substitution" substitution="' + lesson + '"><div class="row"><div class="col-md-4" style="position: relative; margin: 0;"><p style="font-size: 300%; margin: 0; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);">' + lesson + '</p></div><div class="col-md-8"><h4>' + substitutions_type + '</h4></br><h7>' + text + '</h7></div></div></div>')
                }else{
                  $("h3").filter("[klasse='" + klasse + "'][day='" + day + "']", "#klasse").after('<div class="card card-block" style="height: 10%; background-color: #2196F3; color: #fff" id="substitution" substitution="' + lesson + '"><div class="row"><div class="col-md-4" style="position: relative; margin: 0;"><p style="font-size: 350%; margin: 0; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);">' + lesson + '</p></div><div class="col-md-8"><h4>' + substitutions_type + '</h4></br><h7>' + text + '</h7></div></div></div>')
                }
              }else{
                if (substitutions_type == "Betreuung") {
                  if (reg.test(lesson)) {
                    $("h3").filter("[klasse='" + klasse + "'][day='" + day + "']", "#klasse").after('<div class="card card-block" style="height: 10%; background-color: #2196F3; color: #fff" id="substitution" substitution="' + lesson + '"><div class="row"><div class="col-md-4" style="position: relative; margin: 0;"><p style="font-size: 300%; margin: 0; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);">' + lesson + '</p></div><div class="col-md-8"><h4>' + substitutions_type + '</h4></br><h7>' + text + '</h7></div></div></div>')
                  }else{
                    $("h3").filter("[klasse='" + klasse + "'][day='" + day + "']", "#klasse").after('<div class="card card-block" style="height: 10%; background-color: #2196F3; color: #fff" id="substitution" substitution="' + lesson + '>' + '<div class="row"><div class="col-md-4" style="position: relative; margin: 0;"><p style="font-size: 350%; margin: 0; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);">' + lesson + '</p></div><div class="col-md-8"><h4>' + substitutions_type + '</h4></br><h7>' + text + '</h7></div></div></div>')
                  }
                }else{
                  if (substitutions_type == "Unterricht geändert") {
                    if (reg.test(lesson)) {
                      $("h3").filter("[klasse='" + klasse + "'][day='" + day + "']", "#klasse").after('<div class="card card-block" style="height: 10%; background-color: #FFA000; color: #fff" id="substitution" substitution="' + lesson + '"><div class="row"><div class="col-md-4" style="position: relative; margin: 0;"><p style="font-size: 300%; margin: 0; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);">' + lesson + '</p></div><div class="col-md-8"><h4>' + substitutions_type + '</h4></br><h7>' + text + '</h7></div></div></div>')
                    }else{
                      $("h3").filter("[klasse='" + klasse + "'][day='" + day + "']", "#klasse").after('<div class="card card-block" style="height: 10%; background-color: #FFA000; color: #fff" id="substitution" substitution="' + lesson + '"><div class="row">' + '<div class="col-md-4" style="position: relative; margin: 0;"><p style="font-size: 350%; margin: 0; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);">' + lesson + '</p></div><div class="col-md-8"><h4>' + substitutions_type + '</h4></br><h7>' + text + '</h7></div></div></div>')
                    }
                  }else{
                    if (substitutions_type == "Lehrertausch") {
                      if (reg.test(lesson)) {
                        $("h3").filter("[klasse='" + klasse + "'][day='" + day + "']", "#klasse").after('<div class="card card-block" style="height: 10%; background-color: #9C27B0; color: #fff" id="substitution" substitution="' + lesson + '"><div class="row"><div class="col-md-4" style="position: relative; margin: 0;"><p style="font-size: 300%; margin: 0; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);">' + lesson + '</p></div><div class="col-md-8"><h4>' + substitutions_type + '</h4></br><h7>' + text + '</h7></div></div></div>')
                      }else{
                        $("h3").filter("[klasse='" + klasse + "'][day='" + day + "']", "#klasse").after('<div class="card card-block" style="height: 10%; background-color: #9C27B0; color: #fff" id="substitution" substitution="' + lesson + '"><div class="row"><div class="col-md-4" style="position: relative; margin: 0;"><p style="font-size: 350%; margin: 0; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);">' + lesson + '</p></div><div class="col-md-8"><h4>' + substitutions_type + '</h4></br><h7>' + text + '</h7></div></div></div>')
                      }
                    }else{
                      if (substitutions_type == "anderer Raum") {
                        if (reg.test(lesson)) {
                          $("h3").filter("[klasse='" + klasse + "'][day='" + day + "']", "#klasse").after('<div class="card card-block" style="height: 10%; background-color: #9C27B0; color: #fff" id="substitution" substitution="' + lesson + '"><div class="row"><div class="col-md-4" style="position: relative; margin: 0;"><p style="font-size: 300%; margin: 0; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);">' + lesson + '</p></div><div class="col-md-8"><h4>' + substitutions_type + '</h4></br><h7>' + text + '</h7></div></div></div>')
                        }else{
                          $("h3").filter("[klasse='" + klasse + "'][day='" + day + "']", "#klasse").after('<div class="card card-block" style="height: 10%; background-color: #9C27B0; color: #fff" id="substitution" substitution="' + lesson + '"><div class="row"><div class="col-md-4" style="position: relative; margin: 0;"><p style="font-size: 350%; margin: 0; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);">' + lesson + '</p></div><div class="col-md-8"><h4>' + substitutions_type + '</h4></br><h7>' + text + '</h7></div></div></div>')
                        }
                      }else{
                        if (substitutions_type == "Aufgaben") {
                          if (reg.test(lesson)) {
                            $("h3").filter("[klasse='" + klasse + "'][day='" + day + "']", "#klasse").after('<div class="card card-block" style="height: 10%; background-color: #F44336; color: #fff" id="substitution" substitution="' + lesson + '"><div class="row"><div class="col-md-4" style="position: relative; margin: 0;"><p style="font-size: 300%; margin: 0; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);">' + lesson + '</p></div><div class="col-md-8"><h4>' + substitutions_type + '</h4></br><h7>' + text + '</h7></div></div></div>')
                          }else{
                            $("h3").filter("[klasse='" + klasse + "'][day='" + day + "']", "#klasse").after('<div class="card card-block" style="height: 10%; background-color: #F44336; color: #fff" id="substitution" substitution="' + lesson + '"><div class="row"><div class="col-md-4" style="position: relative; margin: 0;"><p style="font-size: 350%; margin: 0; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);">' + lesson + '</p></div><div class="col-md-8"><h4>' + substitutions_type + '</h4></br><h7>' + text + '</h7></div></div></div>')
                          }
                        }else{
                          if (substitutions_type == "Sondereins.") {
                            if (reg.test(lesson)) {
                              $("h3").filter("[klasse='" + klasse + "'][day='" + day + "']", "#klasse").after('<div class="card card-block" style="height: 10%; background-color: #2196F3; color: #fff" id="substitution" substitution="' + lesson + '"><div class="row"><div class="col-md-4" style="position: relative; margin: 0;"><p style="font-size: 300%; margin: 0; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);">' + lesson + '</p></div><div class="col-md-8"><h4>' + substitutions_type + '</h4></br><h7>' + text + '</h7></div></div></div>')
                            }else{
                              $("h3").filter("[klasse='" + klasse + "'][day='" + day + "']", "#klasse").after('<div class="card card-block" style="height: 10%; background-color: #2196F3; color: #fff" id="substitution" substitution="' + lesson + '"><div class="row"><div class="col-md-4" style="position: relative; margin: 0;"><p style="font-size: 350%; margin: 0; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);">' + lesson + '</p></div><div class="col-md-8"><h4>' + substitutions_type + '</h4></br><h7>' + text + '</h7></div></div></div>')
                            }
                          }else{
                            if (substitutions_type == "Entfall") {
                              if (reg.test(lesson)) {
                                $("h3").filter("[klasse='" + klasse + "'][day='" + day + "']", "#klasse").after('<div class="card card-block" style="height: 10%; background-color: #F44336; color: #fff" id="substitution" substitution="' + lesson + '"><div class="row"><div class="col-md-4" style="position: relative; margin: 0;"><p style="font-size: 300%; margin: 0; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);">' + lesson + '</p></div><div class="col-md-8"><h4>' + substitutions_type + '</h4></br><h7>' + text + '</h7></div></div></div>')
                              }else{
                                $("h3").filter("[klasse='" + klasse + "'][day='" + day + "']", "#klasse").after('<div class="card card-block" style="height: 10%; background-color: #F44336; color: #fff" id="substitution" substitution="' + lesson + '"><div class="row"><div class="col-md-4" style="position: relative; margin: 0;"><p style="font-size: 350%; margin: 0; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);">' + lesson + '</p></div><div class="col-md-8"><h4>' + substitutions_type + '</h4></br><h7>' + text + '</h7></div></div></div>')
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
            $.fn.sortSubstitutions = jQuery.fn.sortSubstitutions = function sortSubstitutions() {
              $("> div", this[0]).sort(dec_sort).appendTo(this[0]);
              function dec_sort(a, b){ return ($(b).attr("substitution")) < ($(a).attr("substitution")) ? 1 : -1; }
            }
            $('div#klasse[klasse="' + klasse + '"]').sortSubstitutions();
          })
        })
      })
      $.fn.sortClasses = jQuery.fn.sortClasses = function sortClasses() {
        $("> div", this[0]).sort(dec_sort).appendTo(this[0]);
        function dec_sort(a, b){ return ($(b).attr("klasse")) < ($(a).attr("klasse")) ? 1 : -1; }
      }
      $('#days[day="0"]').sortClasses();
      $('#days[day="1"]').sortClasses();
      console.timeEnd('generateDivs');
    }
  }else{
    console.log(error)
    $("#Main").append('<p class="bg-danger">Scheinbar geht dein Internet nicht :/</p>')
  }
})

$('#Tabs a').click(function (e) {
  e.preventDefault()
  $(this).tab('show')
})

console.timeEnd('RenderData');
