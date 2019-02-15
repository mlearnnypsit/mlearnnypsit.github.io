let selectedText = "";
let focusedInput;
let startIndex;
let shouldGoBackHide = 0;
let notClicked = true;
let file;
let colourTemplate = `{
   "Lecture": "#b0c4de",
   "Practical": "#b0c4de",
   "Tutorial": "#b0c4de",
   "Remark": "#81c784",
   "E-Learning": "#81c784",
   "In Course Assessment": "#FA8072"
}`;
let selectOptions = "{'Lecture','Practical','Tutorial','Remark','E-Learning','In Course Assessment'}";

$(function() {
   // Hiding back arrow
   $(".carousel-control-prev").css("display", "none");

   // Clear the textarea in importTextarea (For some reason it having spaces onload)
   clearImportTextarea();

   // On unfocus
   $(window.document).on("focusout", "#linkInput", checkAndDisplayAlert);

   /*
   // hiding contextmenu on rightClick (Not working)
   $(document).on('mousedown', ":not(.inputDiv)", function(e) {
     if (e.button == 2) {
       alert("right-click");
       // Hide contextMenu if already showing
       $("#rightClickMenu").css("display", "none");
     }
   });
   */

   // Overriding right click menu
   if ($(".inputDiv").addEventListener) { // IE >= 9; other browsers
      $(".inputDiv").addEventListener("contextmenu", function(e) {
         // Get focused Input
         focusedInput = $(":focus");

         // Getting selection offset
         if (typeof window.getSelection != "undefined") {
            let sel = window.getSelection();
            if (sel.rangeCount) {
               startIndex = sel.focusOffset;
            }
         } else if (typeof document.selection != "undefined") {
            if (window.document.selection.type == "Text") {
               startIndex = sel.focusOffset;
            }
         }

         // Get selected text
         if (window.getSelection) {
            selectedText = window.getSelection().toString();
         } else if (window.document.selection && window.document.selection.type != "Control") {
            selectedText = window.document.selection.createRange().text;
         }

         // Show Menu if got value
         if (selectedText) {
            $("#rightClickMenu").css("display", "block");
            $("#rightClickMenu").offset({
               left: e.pageX,
               top: e.pageY
            });

            var evt = e || window.event;
            e.preventDefault();
         }
      }, false);
   } else { // IE < 9
      $(document).on("contextmenu", ".inputDiv", function(e) {
         // Get focused Input
         focusedInput = $(":focus");

         // Getting selection offset
         if (typeof window.getSelection != "undefined") {
            let sel = window.getSelection();
            if (sel.rangeCount) {
               startIndex = sel.focusOffset;
            }
         } else if (typeof document.selection != "undefined") {
            if (document.selection.type == "Text") {
               startIndex = sel.focusOffset;
            }
         }

         // Get selected text
         if (window.getSelection) {
            selectedText = window.getSelection().toString();
         } else if (document.selection && document.selection.type != "Control") {
            selectedText = document.selection.createRange().text;
         }

         // Show Menu if got value
         if (selectedText) {
            $("#rightClickMenu").css("display", "block");
            $("#rightClickMenu").offset({
               left: e.pageX,
               top: e.pageY
            });

            var evt = e || window.event;
            evt.returnValue = false;
            return false;
         }
      });
   }

   $(document).bind("click", function(event) {
      $("#rightClickMenu").css("display", "none");
   });

   $(document).on("mouseover", ".contentDivDivDraggableDiv", function() {
      // Force stop
      $(this).stop(true, true);
      $(this).animate({
         opacity: 1,
         queue: false
      }, 300);
   });

   $(document).on("mouseout", ".contentDivDivDraggableDiv", function() {
      $(this).animate({
         opacity: 0
      }, 300);
   });

   $(document).on("change", "#excelSelectInput", function() {
      if ($(this).hasClass("is-invalid")) {
         $(this).removeClass("is-invalid");
         $(this).addClass("is-valid");
      }
   });

   $(document).on("change", ".remapExcelSelectInput", function() {
      if ($(this).hasClass("is-invalid")) {
         $(this).removeClass("is-invalid");
         $(this).addClass("is-valid");
      }
   });

   // Prevent creating div on enter
   contentEditableBr();

   $(document).on("click", "#instructionPage,#instructionPageCloseBtn", function() {
      localStorage.setItem("instructionViewed", true);
      localStorage.setItem("instructionViewedTime", new Date().getTime());
      $("#instructionPage").fadeOut('slow');
      document.body.style.overflow = "auto";
   });

   $(document).on("click", "#instructionPageModal", function(event) {
      event.stopPropagation();
   });

   // Change cursor back to pointer
   document.body.style.cursor = "auto";
});

/**
 * Navigate to Page 2 of Startup Page.
 * @function
 */
function goPage2() {
   $("#carousel").carousel("next");
   $("#carousel").carousel("pause");
   $(".carousel-control-prev").css("display", "flex");
   shouldGoBackHide++;
}

/**
 * Navigate to Page 3 of Startup Page.
 * @function
 */
function goPage3(lessonPlanTemplateDiv) {
   $("#carousel").carousel("next");
   $("#carousel").carousel("pause");
   $(".carousel-control-prev").css("display", "flex");
   shouldGoBackHide++;

   $("#importPage3Preview").empty();
   $("#importPage3Preview").append(lessonPlanTemplateDiv);
}

/**
 * Navigate back to the previous page of Startup Page.
 * @function
 */
function goBack() {
   // Set progress bar to 0%
   // $(".progress-bar").css("width", "0%");

   // Hiding alerts
   closeAlert();

   // Previous slide
   $("#carousel").carousel("prev");
   $("#carousel").carousel("pause");

   // Hide back arrow when on first page
   shouldGoBackHide--;
   if (shouldGoBackHide <= 0) {
      $(".carousel-control-prev").css("display", "none");
   }
}

/**
 * Hide the startup page and regenerate page1
 * @function
 */
function createNew() {
   $("#startupDiv").fadeOut();

   $("#masterDiv").css("overflow", "auto");

   // If he never view before
   if(localStorage.instructionViewed) {
      // Expries after a week
      if(localStorage.instructionViewedTime && ((new Date().getTime() - localStorage.instructionViewedTime) > (7 * 24 * 60 * 60 * 100))) {
         localStorage.removeItem("instructionViewed");
         localStorage.removeItem("instructionViewedTime");
         document.body.style.overflow = "hidden";
         $("#instructionPageContent").children().first().css("display", "block");
         getInstructionGif(0);
         $("#instructionPage").fadeIn("slow");
      }
   } else {
      document.body.style.overflow = "hidden";
      $("#instructionPageContent").children().first().css("display", "block");
      getInstructionGif(0);
      $("#instructionPage").fadeIn("slow");
   }

   $("#masterDiv").css("height", "unset");
   // Clear Page1
   $("#page1").empty();
   recreatePage1();
}

/**
 * Hide all alerts
 * @function
 */
function closeAlert() {
   // Hiding alerts
   $(".alert").alert("close");
}

/**
 * Checking if input value on the startup page 2 is valid. If not create an alert with error message and appending to container
 * @function
 */
function checkTextIsCorrect() {
   closeAlert();
   // Creating alert
   let alertBox = document.createElement("div");
   alertBox.className = "alert alert-danger fade show";
   alertBox.id = "page2Error";
   alertBox.setAttribute("role", "alert");
   let alertBoxP = document.createElement("p");
   let alertBoxButtonDiv = document.createElement("div");
   let alertBoxButtonDivButton = document.createElement("button");
   alertBoxButtonDivButton.className = "close";
   alertBoxButtonDivButton.setAttribute("type", "button");
   alertBoxButtonDivButton.setAttribute("data-dismiss", "alert");
   alertBoxButtonDivButton.setAttribute("aria-label", "Close");
   let alertBoxButtonDivButtonSpan = document.createElement("span");
   alertBoxButtonDivButton.setAttribute("aria-hidden", "true");
   alertBoxButtonDivButton.innerHTML = "&times;";
   // Appending alert
   alertBoxButtonDivButton.appendChild(alertBoxButtonDivButtonSpan);
   alertBoxButtonDiv.appendChild(alertBoxButtonDivButton);
   alertBox.appendChild(alertBoxP);
   alertBox.appendChild(alertBoxButtonDiv);

   // Checking if textarea is empty
   let textareaValue = $("#importTextarea").val().trim();
   if (textareaValue) {
      // Checking if text include #lessonPlanTemplate
      let tempDiv = $(document.createElement("div"));
      tempDiv.html(textareaValue);
      let checkText = tempDiv.find("#lessonPlanTemplate").html();
      if (checkText) {
         checkText = checkText.trim();
         if (checkText.length > 0) {
            // Creating #lessonPlanTemplate
            let lessonPlanTemplateDiv = document.createElement("div");
            lessonPlanTemplateDiv.id = "lessonPlanTemplate";
            $(lessonPlanTemplateDiv).html(checkText);

            // Go to page3
            goPage3(lessonPlanTemplateDiv);
         } else {
            alertBoxP.appendChild(document.createTextNode("'id=#lessonPlanTemplate' div is empty. Make sure you entered/uploaded correctly"));
            $("#startupDivPage2 > div").prepend(alertBox);

            $("#page2Error").slideDown(function() {
               alertBox.style.display = "flex";
            });
         }
      } else {
         alertBoxP.appendChild(document.createTextNode("'id=#lessonPlanTemplate' div missing. Make sure you entered/uploaded correctly"));
         $("#startupDivPage2 > div").prepend(alertBox);

         $("#page2Error").slideDown(function() {
            alertBox.style.display = "flex";
         });
      }
   } else {
      alertBoxP.appendChild(document.createTextNode("Make sure you entered/uploaded something"));
      $("#startupDivPage2 > div").prepend(alertBox);

      $("#page2Error").slideDown(function() {
         alertBox.style.display = "flex";
      });
   }
}

/**
 * Basically checkTextIsCorrect() without appending to preview
 * @function
 */
function fileMatchesLayout(readerResult) {
   closeAlert();
   // Creating alert
   let alertBox = document.createElement("div");
   alertBox.className = "alert alert-danger fade show";
   alertBox.id = "page2Error";
   alertBox.setAttribute("role", "alert");
   let alertBoxP = document.createElement("p");
   let alertBoxButtonDiv = document.createElement("div");
   let alertBoxButtonDivButton = document.createElement("button");
   alertBoxButtonDivButton.className = "close";
   alertBoxButtonDivButton.setAttribute("type", "button");
   alertBoxButtonDivButton.setAttribute("data-dismiss", "alert");
   alertBoxButtonDivButton.setAttribute("aria-label", "Close");
   let alertBoxButtonDivButtonSpan = document.createElement("span");
   alertBoxButtonDivButton.setAttribute("aria-hidden", "true");
   alertBoxButtonDivButton.innerHTML = "&times;";
   // Appending alert
   alertBoxButtonDivButton.appendChild(alertBoxButtonDivButtonSpan);
   alertBoxButtonDiv.appendChild(alertBoxButtonDivButton);
   alertBox.appendChild(alertBoxP);
   alertBox.appendChild(alertBoxButtonDiv);

   // Checking if file is empty
   let textareaValue = readerResult.trim();
   if (textareaValue) {
      // Checking if text include #lessonPlanTemplate
      let tempDiv = $(document.createElement("div"));
      tempDiv.html(textareaValue);
      let checkText = tempDiv.find("#lessonPlanTemplate").html();
      if (checkText) {
         checkText = checkText.trim();
         if (checkText.length > 0) {
            return true;
         } else {
            alertBoxP.appendChild(document.createTextNode("'id=#lessonPlanTemplate' div is empty. Make sure you entered/uploaded correctly"));
            $("#startupDivPage2 > div").prepend(alertBox);

            $("#page2Error").slideDown(function() {
               alertBox.style.display = "flex";
            });
         }
      } else {
         alertBoxP.appendChild(document.createTextNode("'id=#lessonPlanTemplate' div missing. Make sure you entered/uploaded correctly"));
         $("#startupDivPage2 > div").prepend(alertBox);

         $("#page2Error").slideDown(function() {
            alertBox.style.display = "flex";
         });
      }
   } else {
      alertBoxP.appendChild(document.createTextNode("Make sure you entered/uploaded something"));
      $("#startupDivPage2 > div").prepend(alertBox);

      $("#page2Error").slideDown(function() {
         alertBox.style.display = "flex";
      });
   }
   return false;
}

/**
 * Replace page2 with imported html and hide the startup page
 * @function
 */
function hideStartupDiv() {
   // Appending Preview to Page2
   $("#page2").empty();
   $("#page2").html($("#importPage3Preview").html());

   // Remove preview to prevent conflict
   $("#importPage3Preview").empty();

   // Close the startup div
   createNew();
}

/**
 * I dontknow how do event. Prevent default drop and add border for visual response
 * @event
 */
function allowDrop(ev) {
   if (window.File && window.FileReader && window.FileList && window.Blob) {
      $("#importTextarea").css("border", "5px dashed grey");
      $("#importTextarea").css("border-radius", "20px");
      ev.preventDefault();
   } else {
      // Sorry not supported
      alert("Browser doesn't support drag and drop");
   }
}

/**
 * Remove the border on mouse exit
 * @function
 */
function removeDragCSS() {
   $("#importTextarea").css("border", "");
   $("#importTextarea").css("border-radius", "");
}

/**
 * I dontknow how do event. On drop get the first file and if htm
 * @event
 */
function drop(ev) {
   ev.preventDefault();
   // Remove drag css border
   removeDragCSS();
   $(".progress-bar").css("width", "0%");
   $(".progress-bar")[0].classList.add("progress-bar-animated");
   // Collapse the remappingDiv
   $("#remappingDiv").collapse('hide');
   // Change the remappingDiv icon back to plus
   $("#remapIcon")[0].classList.add("fa-plus-square");
   $("#remapIcon")[0].classList.remove("fa-minus-square");
   // Get the files
   let draggedFiles;
   if (ev.dataTransfer) {
      draggedFiles = ev.dataTransfer.files;
   } else {
      draggedFiles = ev.target.files;
   }

   if (!draggedFiles[0]) {
      return !1;
   }

   // Get the first file
   file = draggedFiles[0];
   let fileReader = new FileReader();
   // Make sure only .html and .txt is accepted
   if (file.type.match("text/plain") || file.type.match("text/html")) {
      /* Not really necessary
      // Set file Input to same as drag
      if(ev.dataTransfer) {
         $("#uploadedFileName")[0].files = ev.dataTransfer.files;
      }
      */

      fileReader.onload = function() {
         let readerResult = fileReader.result;
         if (fileMatchesLayout(readerResult)) {
            $("#uploadedFileName").html(file.name);
            $("#importTextarea").val(readerResult);
         }
      };
      fileReader.onprogress = function(data) {
         if (data.lengthComputable) {
            let progress = parseInt(((data.loaded / data.total) * 100), 10);
            $(".progress-bar").css("width", progress + "%");
            console.log(progress);
         }
      };
      fileReader.onloadend = function() {
         $(".progress-bar")[0].classList.remove("progress-bar-animated");
      };
   } else if (file.type.match("application/vnd.ms-excel") || file.type.match("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")) {
      showColumn(file);
      $("#excelBoxDiv").modal("show");
   } else {
      alert("Only .html, .txt & .xls(x) is the accepted file format");
   }

   fileReader.readAsText(file);
}

function showColumn(file) {
   let fileReader = new FileReader();
   fileReader.onload = function(e) {
      let filename = file.name;
      // pre-process data
      let binary = "";
      let bytes = new Uint8Array(e.target.result);
      let length = bytes.byteLength;
      for (let i = 0; i < length; i++) {
         binary += String.fromCharCode(bytes[i]);
      }
      // call 'xlsx' to read the file
      let workbook = XLSX.read(binary, {
         type: "binary",
         cellDates: true,
         cellStyles: true
      });

      // Clearing selectOptions
      $("#excelSelectInput").empty();
      $("#excelSelectInput2").empty();
      // Adding placeholder
      let placeholderOption = $("<option disabled selected>Please select your primary column</option>");
      $("#excelSelectInput").append(placeholderOption);
      let placeholderOption2 = $("<option selected>Please select your secondary column</option>");
      $("#excelSelectInput2").append(placeholderOption2);
      // Getting the first sheet
      let sheet = workbook.Sheets[workbook.SheetNames[0]];
      let range = XLSX.utils.decode_range(sheet["!ref"]);
      // Empty the remappingDiv
      $("#remappingDiv > .card-body").empty();
      // Looping all columns on first row
      for (let columns = range.s.c; columns <= range.e.c; columns++) {
         let cellRef = XLSX.utils.encode_cell({
            c: columns,
            r: 0
         });
         if (!sheet[cellRef]) {
            continue;
         }
         let cell = sheet[cellRef];
         let x = String(cell.v);

         // Adding to selectOptions
         let option = document.createElement("option");
         option.appendChild(document.createTextNode(x));
         option.value = columns;
         let option2 = document.createElement("option");
         option2.appendChild(document.createTextNode(x));
         option2.value = columns;
         // Title
         $("#excelSelectInput").append(option);
         // subtitle
         $("#excelSelectInput2").append(option2);

         // Remap columns
         let remapFormGroupDiv = document.createElement("div");
         remapFormGroupDiv.className = "form-group";
         let remapFormGroupP = document.createElement("p");
         remapFormGroupP.appendChild(document.createTextNode("Table Header: "));
         remapFormGroupP.className = "remapColumnHeader";
         let remapFormGroupPP = document.createElement("p");
         remapFormGroupPP.appendChild(document.createTextNode(x));
         let remapFormGroupSelectP = document.createElement("p");
         remapFormGroupSelectP.appendChild(document.createTextNode("Map to: "));
         remapFormGroupSelectP.className = "remapColumnHeader";
         let remapFormGroupSelect = document.createElement("select");
         remapFormGroupSelect.className = "custom-select remapExcelSelectInput";
         remapFormGroupSelect.style.marginBottom = "8px";
         // Placeholder
         let placeHolderOption = document.createElement("option");
         placeHolderOption.appendChild(document.createTextNode("Select an option"));
         placeHolderOption.selected = true;
         // Creating options for select (Dropdown)
         let lectureL = document.createElement("option");
         lectureL.appendChild(document.createTextNode("Lecture"));
         lectureL.setAttribute("value", "0");
         let practicalP = document.createElement("option");
         practicalP.appendChild(document.createTextNode("Practical"));
         practicalP.setAttribute("value", "1");
         let tutorialT = document.createElement("option");
         tutorialT.appendChild(document.createTextNode("Tutorial"));
         tutorialT.setAttribute("value", "2");
         let remarkR = document.createElement("option");
         remarkR.appendChild(document.createTextNode("Remark"));
         remarkR.setAttribute("value", "3");
         let eLearningE = document.createElement("option");
         eLearningE.appendChild(document.createTextNode("E-Learning"));
         eLearningE.setAttribute("value", "4");
         let inCourseAssICA = document.createElement("option");
         inCourseAssICA.appendChild(document.createTextNode("In Course Assessment"));
         inCourseAssICA.setAttribute("value", "5");
         remapFormGroupSelect.appendChild(placeHolderOption);
         remapFormGroupSelect.appendChild(lectureL);
         remapFormGroupSelect.appendChild(practicalP);
         remapFormGroupSelect.appendChild(tutorialT);
         remapFormGroupSelect.appendChild(remarkR);
         remapFormGroupSelect.appendChild(eLearningE);
         remapFormGroupSelect.appendChild(inCourseAssICA);

         remapFormGroupDiv.appendChild(remapFormGroupP);
         remapFormGroupDiv.appendChild(remapFormGroupPP);
         remapFormGroupDiv.appendChild(remapFormGroupSelectP);
         remapFormGroupDiv.appendChild(remapFormGroupSelect);

         $("#remappingDiv > .card-body").append(remapFormGroupDiv);
      }
   };
   fileReader.readAsArrayBuffer(file);
}

function excelMoveToPage(pageIndex) {
   switch (pageIndex) {
      case 1:
         $("#excelPage1").fadeIn();
         $("#excelPage2").fadeOut();
         break;
      case 2:
         if ($("#excelSelectInput").val() && $("#excelSelectInput").val() >= 0) {
            $("#excelPage3")[0].style.left = "5%";
            $("#excelPage3")[0].style.top = "10%";
            $("#excelPage3").css("position", "absolute");
            $("#excelPage1").fadeOut();
            $("#excelPage2").fadeIn();
            $("#excelPage3").fadeOut();
            $(".modal-footer > button:nth-child(2)").css("display", "none");
         } else {
            // Validation show red
            $("#excelSelectInput").addClass("is-invalid");
         }
         $("#excelPage3 > .excelPopupButtonDiv > button").css("position", "block");
         break;
      case 3:
         $("#excelPage2").fadeOut();
         $("#excelPage3").fadeIn(function() {
            $("#excelPage3")[0].style.left = 0;
            $("#excelPage3")[0].style.top = 0;
            $("#excelPage3").css("position", "relative");
         });
         $(".modal-footer > button:nth-child(2)").css("display", "block");
         break;
      default:
         alert("What? How is this possible... Stop it");
   }
}

function startProcessingExcel() {
   if ($("#excelSelectInput").val() && $("#excelSelectInput").val() >= 0) {
      // Get whether user want to merge headers
      let userSelectMerge = document.getElementById("customControlAutosizing").checked;
      // LessonPlanTemplate
      let lessonPlanTemplate = document.createElement("div");
      lessonPlanTemplate.id = "lessonPlanTemplate";
      // Instructors
      let instructors = document.createElement("p");
      instructors.appendChild(document.createTextNode("Instructors Details"));
      // Instructors Details
      let instructorsDetails = document.createElement("div");
      // Adding all classes
      instructors.className = "bold underline";
      instructorsDetails.id = "instructorsDetails";
      // Appending Everything
      lessonPlanTemplate.append(instructors);
      lessonPlanTemplate.append(instructorsDetails);


      // Getting the primary column number
      let selectedValue = $("#excelSelectInput").val();
      let selectedSubValue = $("#excelSelectInput2").val();
      if (selectedValue >= 0) {
         // Show name on file input
         $("#uploadedFileName").html(file.name);

         let workbookSheet;

         let fileReader = new FileReader();
         fileReader.onload = function(e) {
            let filename = file.name;
            // pre-process data
            let binary = "";
            let bytes = new Uint8Array(e.target.result);
            let length = bytes.byteLength;
            for (let i = 0; i < length; i++) {
               binary += String.fromCharCode(bytes[i]);
            }
            // call 'xlsx' to read the file
            let workbook = XLSX.read(binary, {
               type: "binary",
               cellDates: true,
               cellStyles: true
            });

            // Getting the first sheet
            let sheet = workbook.Sheets[workbook.SheetNames[0]];
            let range = XLSX.utils.decode_range(sheet["!ref"]);

            workbookSheet = {
               "sheet": sheet,
               "range": range
            };

            // Check if loadSheet is empty
            if (workbookSheet) {
               // Map the columns first
               let range = workbookSheet.range;
               let columnMapping = {
                  lecture: [],
                  practical: [],
                  tutorial: [],
                  remark: [],
                  eLearning: [],
                  iCA: []
               };

               columnMapping = getRemapFromInput(columnMapping, selectedValue, selectedSubValue);
               let notMarkedArray = [];
               for (let columns = range.s.c; columns <= range.e.c; columns++) {
                  // Skip if user mapped
                  let doSkip = !1;
                  for (keyValue in columnMapping) {
                     if (columnMapping.hasOwnProperty(keyValue)) {
                        for (i = 0; i < columnMapping[keyValue].length; i++) {
                           if (parseInt(columnMapping[keyValue][i]) === columns) {
                              doSkip = !0;
                              break;
                           }
                        }
                     }
                  }

                  if (doSkip) {
                     continue;
                  }

                  let cellRef = XLSX.utils.encode_cell({
                     c: columns,
                     r: 0
                  });
                  if (!sheet[cellRef]) {
                     continue;
                  }
                  let cell = sheet[cellRef];
                  let x = String(cell.v).toLowerCase();

                  if (x.indexOf("lecture") !== -1) {
                     columnMapping.lecture.push(columns);
                  } else if (x.indexOf("practical") !== -1) {
                     columnMapping.practical.push(columns);
                  } else if (x.indexOf("tutorial") !== -1) {
                     columnMapping.tutorial.push(columns);
                  } else if (x.indexOf("remark") !== -1) {
                     columnMapping.remark.push(columns);
                  } else if (x.indexOf("e-learning") !== -1 || x.indexOf("elearning") !== -1) {
                     columnMapping.eLearning.push(columns);
                  } else if (x.indexOf("ica") !== -1 || x.indexOf("in course assessment") !== -1) {
                     columnMapping.iCA.push(columns);
                  } else {
                     if (columns !== parseInt(selectedValue) && columns !== parseInt(selectedSubValue)) {
                        notMarkedArray.push(columns);
                     }
                  }
               }

               if (notMarkedArray.length > 0) {
                  let confirmationQuestion = "Some columns could not be mapped automatically. Do you want to continue without mapping the Column(s): ";
                  let first = true;
                  for (let i = 0; i < notMarkedArray.length; i++) {
                     let cellRef = XLSX.utils.encode_cell({
                        c: notMarkedArray[i],
                        r: 0
                     });
                     if (!sheet[cellRef]) {
                        continue;
                     }
                     let cell = sheet[cellRef];
                     let x = String(cell.v);

                     $("#remappingDiv > .card-body").children().eq(notMarkedArray[i]).find("select").addClass("is-invalid");
                     if (first) {
                        confirmationQuestion += x;
                        first = false;
                     } else if (i === (notMarkedArray.length - 1)) {
                        confirmationQuestion += " & " + x + "?";
                     } else {
                        confirmationQuestion += ", " + x;
                     }
                  }

                  if (!confirm(confirmationQuestion)) {
                     return !1;
                  }
               }

               // Get the primary first
               // +1 to not read header/title of table
               for (let rows = (range.s.r + 1); rows <= range.e.r; rows++) {
                  let cellRef = XLSX.utils.encode_cell({
                     c: selectedValue,
                     r: rows
                  });
                  // Skipping if it is empty & it is one of the merged cell & it is not the first merged cell
                  if (!sheet[cellRef] && checkIfMerged(sheet, selectedValue, rows).direction === "row" && rows > checkIfMerged(sheet, selectedValue, rows).sR) {
                     continue;
                  }
                  let cell = sheet[cellRef];

                  // Create Lesson
                  let lesson = document.createElement("div");
                  let lessonHeader = document.createElement("div");
                  // Lesson Title
                  let lessonTitle = document.createElement("p");
                  // Lesson Subtitle
                  let lessonSubtitle = document.createElement("p");

                  // Adding all classes
                  lesson.className = "lesson";
                  lessonHeader.className = "lessonHeader";
                  lessonTitle.className = "bold";
                  lessonSubtitle.className = "em";

                  // Checking whether is link
                  if(cell) {
                     if (cell.l) {
                        if (!isNaN(cell.v)) {
                           $(lessonTitle).html("<a href='" + cell.l.Target + "' target='_blank'>Week " + cell.v + "</a>");
                        } else {
                           $(lessonTitle).html("<a href='" + cell.l.Target + "' target='_blank'>" + cell.v + "</a>");
                        }
                     } else {
                        if (!isNaN(cell.v)) {
                           $(lessonTitle).html("Week " + cell.v);
                        } else {
                           $(lessonTitle).html(cell.v);
                        }
                     }
                  }

                  // If subtitle is set
                  if (selectedSubValue && selectedSubValue >= 0) {
                     let cellSubRef;

                     let selectedSubValueMerge = checkIfMerged(sheet, selectedSubValue, rows);
                     if (selectedSubValueMerge.found) {
                        cellSubRef = XLSX.utils.encode_cell({
                           c: selectedSubValueMerge.sC,
                           r: selectedSubValueMerge.sR
                        });
                     } else {
                        cellSubRef = XLSX.utils.encode_cell({
                           c: selectedSubValue,
                           r: rows
                        });
                     }

                     if (sheet[cellSubRef]) {
                        let cellSub = sheet[cellSubRef];
                        let xSub = String(cellSub.v);

                        // Checking whether is link
                        if (cellSub.l) {
                           if (!isNaN(cellSub.v)) {
                              $(lessonSubtitle).html("<a href='" + cellSub.l.Target + "' target='_blank'>Week " + cellSub.v + "</a>");
                           } else {
                              $(lessonSubtitle).html("<a href='" + cellSub.l.Target + "' target='_blank'>" + cellSub.v + "</a>");
                           }
                        } else {
                           if (!isNaN(cellSub.v)) {
                              $(lessonSubtitle).html("Week " + xSub);
                           } else {
                              $(lessonSubtitle).html(xSub);
                           }
                        }
                     }
                  }

                  // Appending Lesson header before loop
                  lessonHeader.appendChild(lessonTitle);
                  lessonHeader.appendChild(lessonSubtitle);
                  lesson.appendChild(lessonHeader);

                  let mergeObject = checkIfMerged(sheet, selectedValue, rows);
                  if (mergeObject.direction === "row") {
                     let rowsRemaining = mergeObject.eR - mergeObject.sR;

                     for (let columns = range.s.c; columns <= range.e.c; columns++) {
                        let previousUL = null;

                        // Skip the selected Value
                        if (columns == selectedValue || columns == selectedSubValue) {
                           continue;
                        }

                        for (let y = rows; y <= (rows + rowsRemaining); y++) {
                           // If not first and the cell is merged in rows with the primary, skip
                           if (y > rows && checkIfMerged(sheet, columns, rows).direction === "row") {
                              continue;
                           }

                           let cellRef2;
                           // Check if it is Merged
                           let divsss = checkIfMerged(sheet, columns, y);
                           if (divsss.direction === "column" || divsss.direction === "both") {
                              // If merged get first value
                              cellRef2 = XLSX.utils.encode_cell({
                                 c: divsss.sC,
                                 r: divsss.sR
                              });
                           } else {
                              cellRef2 = XLSX.utils.encode_cell({
                                 c: columns,
                                 r: y
                              });
                           }

                           if (!sheet[cellRef2]) {
                              continue;
                           }

                           // Create header
                           let divss = getHeader(columnMapping, columns);
                           let lecPracHeader = divss.header;
                           let lecPracDiv = divss.lecPrac;
                           // Lesson Plan Content
                           let lessonPlanContent = document.createElement("div");
                           // Lesson Plan Title
                           let lessonPlanContentTitleP = document.createElement("p");
                           // Lesson Plan Topics
                           let lessonPlanContentListUl = document.createElement("ul");
                           // Adding all classes
                           lessonPlanContent.className = "lessonPlanContent";
                           lessonPlanContentTitleP.className = "lessonPlanContentP";

                           // Create ContentList
                           let cell2 = sheet[cellRef2];
                           let x2 = String(cell2.v);
                           let xArray = x2.trim().split("\n");
                           // Checking whether is link
                           let lines = "";
                           if (cell2.l) {
                              xArray = cell2.v.trim().split("\n");
                              for (let i = 0; i < xArray.length; i++) {
                                 lines += "<li><a href='" + cell2.l.Target + "' target='_blank'>" + xArray[i] + "</a></li>";
                              }
                           } else {
                              for (let i = 0; i < xArray.length; i++) {
                                 lines += "<li>" + xArray[i] + "</li>";
                              }
                           }

                           $(lessonPlanContentListUl).html(lines);

                           // Appending Everything
                           lessonPlanContent.appendChild(lessonPlanContentTitleP);
                           lessonPlanContent.appendChild(lessonPlanContentListUl);
                           lecPracHeader.appendChild(lecPracDiv);
                           lecPracHeader.appendChild(lessonPlanContent);

                           // Appending to lesson
                           lesson.appendChild(lecPracHeader);

                           // If the checkbox is checked (default) to merge the headers
                           if (userSelectMerge) {
                              // If got previous, merge the Topics
                              if (previousUL) {
                                 if (y > rows && (checkIfMerged(sheet, columns, rows).direction === "row" || checkIfMerged(sheet, columns, rows).direction === "both")) {
                                    continue;
                                 }
                                 let previousULList = previousUL.find(".lessonPlanContent > ul");
                                 let lines = previousULList.html() + lessonPlanContentListUl.innerHTML;
                                 $(previousULList).html(lines);
                                 $(lecPracHeader).remove();
                                 continue;
                              }

                              // Store previous lesson
                              previousUL = $(lecPracHeader);
                           }
                        }
                        // Appending lesson to Page2
                        lessonPlanTemplate.appendChild(lesson);
                     }
                  } else {
                     for (let columns = range.s.c; columns <= range.e.c; columns++) {
                        // Skip the selected Value
                        if (columns == selectedValue || columns == selectedSubValue) {
                           continue;
                        }
                        let cellRef2;
                        // Check if it is Merged
                        let divsss = checkIfMerged(sheet, columns, rows);
                        if (divsss.direction === "column" || divsss.direction === "both" || divsss.direction === "row") {
                           // If merged get first value
                           cellRef2 = XLSX.utils.encode_cell({
                              c: divsss.sC,
                              r: divsss.sR
                           });
                        } else {
                           cellRef2 = XLSX.utils.encode_cell({
                              c: columns,
                              r: rows
                           });
                        }

                        if (!sheet[cellRef2]) {
                           continue;
                        }
                        // Create header
                        let divss = getHeader(columnMapping, columns);
                        let lecPracHeader = divss.header;
                        let lecPracDiv = divss.lecPrac;
                        // Lesson Plan Content
                        let lessonPlanContent = document.createElement("div");
                        // Lesson Plan Title
                        let lessonPlanContentTitleP = document.createElement("p");
                        // Lesson Plan Topics
                        let lessonPlanContentListUl = document.createElement("ul");
                        // Adding all classes
                        lessonPlanContent.className = "lessonPlanContent";
                        lessonPlanContentTitleP.className = "lessonPlanContentP";

                        // Create ContentList
                        let cell2 = sheet[cellRef2];
                        let x2 = String(cell2.v);
                        let xArray = x2.trim().split("\n");
                        // Checking whether is link
                        let lines = "";
                        if (cell2.l) {
                           xArray = cell2.v.trim().split("\n");
                           for (let i = 0; i < xArray.length; i++) {
                              lines += "<li><a href='" + cell2.l.Target + "' target='_blank'>" + xArray[i] + "</a></li>";
                           }
                        } else {
                           for (let i = 0; i < xArray.length; i++) {
                              lines += "<li>" + xArray[i] + "</li>";
                           }
                        }

                        $(lessonPlanContentListUl).html(lines);

                        // Appending Everything
                        lessonPlanContent.appendChild(lessonPlanContentTitleP);
                        lessonPlanContent.appendChild(lessonPlanContentListUl);
                        lecPracHeader.appendChild(lecPracDiv);
                        lecPracHeader.appendChild(lessonPlanContent);

                        // Appending to lesson
                        lesson.appendChild(lecPracHeader);
                     }
                     // Appending lesson to Page2
                     lessonPlanTemplate.appendChild(lesson);
                  }
               }
               $("#importTextarea").val(lessonPlanTemplate.outerHTML);
               $("#excelBoxDiv").modal("hide");
               $("#excelSelectInput").removeClass("is-valid");
               // Reset page back to first
               excelMoveToPage(2);
               excelMoveToPage(1);
            }
         };
         // Progress bar
         fileReader.onprogress = function(data) {
            if (data.lengthComputable) {
               let progress = parseInt(((data.loaded / data.total) * 100), 10);
               $(".progress-bar").css("width", progress + "%");
            }
         };

         fileReader.onloadend = function() {
            $(".progress-bar")[0].classList.remove("progress-bar-animated");
         };

         fileReader.readAsArrayBuffer(file);
      }
   } else {
      // Validation show red
      $("#excelSelectInput").addClass("is-invalid");
   }
}

function getHeader(columnMapping, column) {
   // lecPracHeader
   let lecPracHeader = document.createElement("div");
   // LecPracDiv
   let lecPracDiv = document.createElement("div");
   let lecPracDivP = document.createElement("p");
   lecPracDiv.appendChild(lecPracDivP);

   // Adding all classes
   lecPracHeader.className = "lecPracHeader";
   lecPracDiv.className = "lecPracDiv";
   lecPracDivP.className = "bold";

   let headerValue = checkIfColumnsHeader(columnMapping, column);
   if (headerValue) {
      $(lecPracDivP).html(headerValue);
      let colourTemplateJson = JSON.parse(colourTemplate);
      if (colourTemplateJson[headerValue]) {
         lecPracDiv.style.background = colourTemplateJson[headerValue];
      }
   } else {
      // (Default)
      // Create input with lecture selected
      $(lecPracDivP).html("Lecture");
      let colourTemplateJson = JSON.parse(colourTemplate);
      if (colourTemplateJson["Lecture"]) {
         lecPracDiv.style.background = colourTemplateJson["Lecture"];
      }
   }

   return {
      header: lecPracHeader,
      lecPrac: lecPracDiv
   };
}

function checkIfColumnsHeader(columnMapping, column) {
   let headerValue = null;
   for (let keyValue in columnMapping) {
      if (columnMapping.hasOwnProperty(keyValue)) {
         for (i = 0; i < columnMapping[keyValue].length; i++) {
            if (parseInt(columnMapping[keyValue][i]) === column) {
               // See is which
               if (keyValue === "lecture") {
                  headerValue = "Lecture";
                  break;
               } else if (keyValue === "practical") {
                  headerValue = "Practical";
                  break;
               } else if (keyValue === "tutorial") {
                  headerValue = "Tutorial";
                  break;
               } else if (keyValue === "remark") {
                  headerValue = "Remark";
                  break;
               } else if (keyValue === "eLearning") {
                  headerValue = "E-Learning";
                  break;
               } else if (keyValue === "iCA") {
                  headerValue = "In Course Assessment";
                  break;
               }
            }
         }
      }
   }
   return headerValue;
}

function getRemapFromInput(remapArray, selectedValue, selectedSubValue) {
   $("#remappingDiv > .card-body").children().each(function(index) {
      if (index === selectedValue || index === selectedSubValue) {
         return !1;
      }

      switch (parseInt($(this).find("select").val())) {
         case 0:
            // Lecture
            remapArray.lecture.push(index);
            break;
         case 1:
            // Practical
            remapArray.practical.push(index);
            break;
         case 2:
            // Tutorial
            remapArray.tutorial.push(index);
            break;
         case 3:
            // Remark
            remapArray.remark.push(index);
            break;
         case 4:
            // E-Learning
            remapArray.eLearning.push(index);
            break;
         case 5:
            // In Course Assessment
            remapArray.iCA.push(index);
            break;
      }
   });
   return remapArray;
}

function disableRemap() {
   $("#remappingDiv > .card-body").children().each(function() {
      let selectOption = $(this).find("select");
      if (selectOption[0].hasAttribute("disabled")) {
         selectOption.removeAttr("disabled");
      }
   });

   if ($("#excelSelectInput").val()) {
      let excelSelectInputSelect = $("#remappingDiv > .card-body").children().eq($("#excelSelectInput").val()).find("select");
      excelSelectInputSelect.attr("disabled", "disabled");
      excelSelectInputSelect[0].selectedIndex = "0";
   }
   if ($("#excelSelectInput2")[0].selectedIndex !== 0) {
      let excelSelectInput2Select = $("#remappingDiv > .card-body").children().eq($("#excelSelectInput2").val()).find("select");
      excelSelectInput2Select.attr("disabled", "disabled");
      excelSelectInput2Select[0].selectedIndex = "0";
   }
}

function changeRemapIcon() {
   if ($("#remapIcon").hasClass("fa-plus-square")) {
      $("#remapIcon")[0].classList.add("fa-minus-square");
      $("#remapIcon")[0].classList.remove("fa-plus-square");
   } else {
      $("#remapIcon")[0].classList.add("fa-plus-square");
      $("#remapIcon")[0].classList.remove("fa-minus-square");
   }
}

function checkIfMerged(sheet, column, row) {
   let json = sheet["!merges"];
   if (json) {
      let valueArray = Object.values(json);

      for (let i = 0; i < valueArray.length; i++) {
         let sC = valueArray[i].s.c;
         let eC = valueArray[i].e.c;
         let sR = valueArray[i].s.r;
         let eR = valueArray[i].e.r;
         // If it is merged
         if (column >= sC && column <= eC && row >= sR && row <= eR) {
            // If column is merged
            if (eC > sC) {
               // If row is merged
               if (eR > sR) {
                  // Direction both
                  return {
                     found: true,
                     sC: sC,
                     eC: eC,
                     sR: sR,
                     eR: eR,
                     direction: "both"
                  }
               } else {
                  // Direction column
                  return {
                     found: true,
                     sC: sC,
                     eC: eC,
                     sR: sR,
                     eR: eR,
                     direction: "column"
                  }
               }
            } else {
               if (eR > sR) {
                  // Direction Row
                  return {
                     found: true,
                     sC: sC,
                     eC: eC,
                     sR: sR,
                     eR: eR,
                     direction: "row"
                  }
               }
            }
         }
      }
   }

   // Direction none
   return {
      found: false,
      sC: null,
      eC: null,
      sR: null,
      eR: null,
      direction: "none"
   }
}

function clearImportTextarea() {
   $("#inputGroupFile01").val(null);
   $("#uploadedFileName").html("Choose file");
   $("#importTextarea").val("");
   $(".progress-bar").css("width", "0%");
}

function makeSortable() {
   //if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
      // Making contentDivDiv sortable
      $(".mainSection").sortable({
         connectWith: ".mainSection",
         items: ".contentDivDiv",
         handle: ".contentDivDivDraggableDiv",
         cancel: ".inputDiv, textarea, input, button",
         update: function() {
            setActualValue();
         },
         axis: "y",
         cursor: "move",
         opacity: 0.5
      });

      // Making mainSection sortable
      $("#page1").sortable({
         items: ".mainSection",
         cancel: ":not('.draggableDiv')"
      });
   //}
}

function removeLessonContent(closeImg) {
   $(closeImg).parent().fadeOut("swing", function() {
      $(closeImg).parent().remove();

      // Rebuilt Page2
      recreatePage2();
   });
}

function addLessonContent(addLessonDiv) {
   let contentDivDiv = document.createElement("div");

   // Creating contentDivDivDraggableDiv
   let contentDivDivDraggableDiv = document.createElement("div");
   contentDivDivDraggableDiv.className = "contentDivDivDraggableDiv progress-bar-striped bg-success";
   contentDivDivDraggableDiv.style.opacity = "0";

   // Creating contentDivDivRight
   let contentDivDivRight = document.createElement("div");
   contentDivDivRight.className = "contentDivDivRight";

   let leftDiv = document.createElement("div");
   let leftDivP = document.createElement("p");
   let leftDivTextInput = document.createElement("select");
   let leftDivColorInput = document.createElement("input");

   let rightDiv = document.createElement("div");
   let page1Content = document.createElement("div");
   let page1ContentTitle = document.createElement("p");
   let page1ContentTitleTextInputDiv = document.createElement("div");
   let page1ContentTitleTextInput = document.createElement("input");
   let page1ContentList = document.createElement("p");
   let page1ContentListTextareaDiv = document.createElement("div");
   let page1ContentListTextarea = document.createElement("textarea");

   let closeImg = document.createElement("button");
   let closeImgImage = document.createElement("span");

   contentDivDiv.className = "section contentDivDiv";
   leftDiv.className = "leftDiv";
   leftDivTextInput.className = "inputDiv custom-select";
   leftDivColorInput.className = "form-control";
   rightDiv.className = "flex rightDiv";
   page1Content.className = "page1Content";

   closeImg.className = "closeImg close";
   closeImg.setAttribute("onclick", "removeLessonContent(this)");
   closeImg.setAttribute("type", "button");
   closeImg.setAttribute("aria-label", "Close");
   closeImgImage.setAttribute("aria-hidden", "true");
   closeImgImage.innerHTML = "&times;";

   leftDivColorInput.setAttribute("type", "color");
   page1ContentTitleTextInput.setAttribute("type", "text");

   leftDivTextInput.setAttribute("onchange", "setActualColour(this)");
   leftDivColorInput.setAttribute("onchange", "setActualValue()");
   page1ContentTitleTextInput.setAttribute("onkeyup", "inputToDiv(this)");
   page1ContentTitleTextInput.setAttribute("onkeydown", "inputToDiv(this)");
   page1ContentListTextarea.setAttribute("onkeyup", "inputToDiv(this)");
   page1ContentListTextarea.setAttribute("onkeydown", "inputToDiv(this)");

   //leftDivTextInputDiv.contentEditable = "true";
   //leftDivTextInputDiv.className = "inputDiv contenteditableBr";
   //leftDivTextInputDiv.setAttribute("onkeyup", "divToInput(this)");
   //leftDivTextInputDiv.setAttribute("onkeydown", "divToInput(this)");
   page1ContentTitleTextInputDiv.contentEditable = "true";
   page1ContentTitleTextInputDiv.className = "inputDiv contenteditableBr form-control";
   page1ContentTitleTextInputDiv.setAttribute("onkeyup", "divToInput(this)");
   page1ContentTitleTextInputDiv.setAttribute("onkeydown", "divToInput(this)");
   page1ContentListTextareaDiv.contentEditable = "true";
   page1ContentListTextareaDiv.className = "inputDiv form-control";
   page1ContentListTextareaDiv.setAttribute("onkeyup", "divToInput(this)");
   page1ContentListTextareaDiv.setAttribute("onkeydown", "divToInput(this)");

   $(page1ContentListTextareaDiv).html("<ul><li><br></li></ul>");
   // Prevent backspace
   $(page1ContentListTextareaDiv).keydown(function(e) {
      // trap the return key being pressed
      if (e.keyCode === 8) {
         if ($(this).html() === "<ul><li><br></li></ul>") {
            // prevent the default behaviour of return key pressed
            return false;
         }
      }
   });

   // Getting default (lecture) colour
   let colourTemplateJson = JSON.parse(colourTemplate);
   $(leftDivColorInput).css("display", "none"); // Hiding real input
   leftDivColorInput.value = colourTemplateJson["Lecture"];
   $(page1ContentTitleTextInput).css("display", "none"); // Hiding real input
   $(page1ContentListTextarea).css("display", "none"); // Hiding real input

   $(page1ContentListTextarea).text("<ul><li>>br></li></ul>");

   // Creating options for select (Dropdown)
   let lectureL = document.createElement("option");
   lectureL.appendChild(document.createTextNode("Lecture"));
   lectureL.setAttribute("value", "Lecture");
   let practicalP = document.createElement("option");
   practicalP.appendChild(document.createTextNode("Practical"));
   practicalP.setAttribute("value", "Practical");
   let tutorialT = document.createElement("option");
   tutorialT.appendChild(document.createTextNode("Tutorial"));
   tutorialT.setAttribute("value", "Tutorial");
   let remarkR = document.createElement("option");
   remarkR.appendChild(document.createTextNode("Remark"));
   remarkR.setAttribute("value", "Remark");
   let eLearningE = document.createElement("option");
   eLearningE.appendChild(document.createTextNode("E-Learning"));
   eLearningE.setAttribute("value", "E-Learning");
   let inCourseAssICA = document.createElement("option");
   inCourseAssICA.appendChild(document.createTextNode("In Course Assessment"));
   inCourseAssICA.setAttribute("value", "In Course Assessment");
   leftDivTextInput.appendChild(lectureL);
   leftDivTextInput.appendChild(practicalP);
   leftDivTextInput.appendChild(tutorialT);
   leftDivTextInput.appendChild(remarkR);
   leftDivTextInput.appendChild(eLearningE);
   leftDivTextInput.appendChild(inCourseAssICA);

   leftDivP.appendChild(document.createTextNode("Lesson/ICA Type"));
   leftDiv.appendChild(leftDivP);
   //leftDiv.appendChild(leftDivTextInputDiv);
   leftDiv.appendChild(leftDivTextInput);
   leftDiv.appendChild(leftDivColorInput);

   page1ContentTitle.appendChild(document.createTextNode("Title"));
   page1ContentList.appendChild(document.createTextNode("Topics"));
   page1Content.appendChild(page1ContentTitle);
   page1Content.appendChild(page1ContentTitleTextInputDiv);
   page1Content.appendChild(page1ContentTitleTextInput);
   page1Content.appendChild(page1ContentList);
   page1Content.appendChild(page1ContentListTextareaDiv);
   page1Content.appendChild(page1ContentListTextarea);
   rightDiv.appendChild(page1Content);

   closeImg.appendChild(closeImgImage);

   contentDivDivRight.appendChild(leftDiv);
   contentDivDivRight.appendChild(rightDiv);
   contentDivDiv.appendChild(contentDivDivDraggableDiv);
   contentDivDiv.appendChild(contentDivDivRight);
   contentDivDiv.appendChild(closeImg);

   $(addLessonDiv).before(contentDivDiv);

   // Showing all input and Textarea if notClicked
   if (!notClicked) {
      $(".inputDiv").next().css("display", "block");
      $("textarea").css("display", "block");
   }

   // Prevent creating div on enter
   contentEditableBr();

   // Rebuilt Page2
   recreatePage2();

   // Making items sortable
   makeSortable();
}

function addLessonSection(addSectionDiv) {
   let mainSection = document.createElement("div");
   let lessonSection = document.createElement("div");
   let lessonTitleP = document.createElement("p");
   let lessonTitleTextInputDiv = document.createElement("div");
   let lessonTitleTextInput = document.createElement("input");
   let lessonSubtitleP = document.createElement("p");
   let lessonSubtitleTextInputDiv = document.createElement("div");
   let lessonSubtitleTextInput = document.createElement("input");
   let lessonSubtitleColorInput = document.createElement("input");

   let contentDivDiv = document.createElement("div");

   // Creating contentDivDivDraggableDiv
   let contentDivDivDraggableDiv = document.createElement("div");
   contentDivDivDraggableDiv.className = "contentDivDivDraggableDiv progress-bar-striped bg-success";
   contentDivDivDraggableDiv.style.opacity = "0";

   // Creating contentDivDivRight
   let contentDivDivRight = document.createElement("div");
   contentDivDivRight.className = "contentDivDivRight";

   let leftDiv = document.createElement("div");
   let leftDivP = document.createElement("p");
   let leftDivTextInput = document.createElement("select");
   let leftDivColorInput = document.createElement("input");

   let rightDiv = document.createElement("div");
   let page1Content = document.createElement("div");
   let page1ContentTitle = document.createElement("p");
   let page1ContentTitleTextInputDiv = document.createElement("div");
   let page1ContentTitleTextInput = document.createElement("input");
   let page1ContentList = document.createElement("p");
   let page1ContentListTextareaDiv = document.createElement("div");
   let page1ContentListTextareaDivUl = document.createElement("ul");
   let page1ContentListTextarea = document.createElement("textarea");

   let closeImg = document.createElement("button");
   let closeImgImage = document.createElement("span");

   let addLessonContent = document.createElement("div");
   let addLessonContentImg = document.createElement("i");
   let addLessonContentP = document.createElement("p");

   let closeImg2 = document.createElement("button");
   let closeImgImage2 = document.createElement("span");

   mainSection.className = "mainSection section";
   lessonSection.className = "lessonTitle";

   contentDivDiv.className = "section contentDivDiv";
   leftDiv.className = "leftDiv";
   leftDivTextInput.className = "inputDiv custom-select";
   leftDivColorInput.className = "form-control";
   rightDiv.className = "flex rightDiv";
   page1Content.className = "page1Content";
   page1ContentTitleTextInputDiv.className = "contenteditableBr form-control";
   closeImg.className = "closeImg close";
   closeImg.setAttribute("onclick", "removeLessonContent(this)");
   closeImg.setAttribute("type", "button");
   closeImg.setAttribute("aria-label", "Close");
   closeImgImage.setAttribute("aria-hidden", "true");
   closeImgImage.innerHTML = "&times;";

   addLessonContentP.appendChild(document.createTextNode("Add New Lesson/ICA"));
   addLessonContentImg.className = "fas fa-plus-circle";
   addLessonContent.className = "addLessonContent";
   addLessonContent.setAttribute("onclick", "addLessonContent(this)");

   closeImg2.className = "closeImg close";
   closeImg2.setAttribute("onclick", "removeLessonContent(this)");
   closeImg2.setAttribute("type", "button");
   closeImg2.setAttribute("aria-label", "Close");
   closeImgImage2.setAttribute("aria-hidden", "true");
   closeImgImage2.innerHTML = "&times;";

   lessonTitleTextInput.setAttribute("type", "text");
   lessonTitleTextInput.className = "lessonTitleInput form-control";
   lessonSubtitleTextInput.setAttribute("type", "text");
   lessonSubtitleTextInput.className = "lessonSubtitleInput form-control";
   lessonSubtitleColorInput.className = "form-control showAllInput";
   lessonSubtitleColorInput.setAttribute("onchange", "setActualValue()");
   lessonSubtitleColorInput.setAttribute("type", "color");
   $(lessonSubtitleColorInput).val("#87cefa");
   leftDivColorInput.setAttribute("type", "color");
   page1ContentTitleTextInput.setAttribute("type", "text");

   lessonTitleTextInput.setAttribute("onkeyup", "inputToDiv(this)");
   lessonTitleTextInput.setAttribute("onkeydown", "inputToDiv(this)");
   lessonSubtitleTextInput.setAttribute("onkeyup", "inputToDiv(this)");
   lessonSubtitleTextInput.setAttribute("onkeydown", "inputToDiv(this)");
   leftDivTextInput.setAttribute("onchange", "setActualColour(this)");
   leftDivColorInput.setAttribute("onchange", "setActualValue()");
   page1ContentTitleTextInput.setAttribute("onkeyup", "inputToDiv(this)");
   page1ContentTitleTextInput.setAttribute("onkeydown", "inputToDiv(this)");
   page1ContentListTextarea.setAttribute("onkeyup", "inputToDiv(this)");
   page1ContentListTextarea.setAttribute("onkeydown", "inputToDiv(this)");

   lessonTitleTextInputDiv.contentEditable = "true";
   lessonTitleTextInputDiv.className = "inputDiv contenteditableBr form-control";
   lessonTitleTextInputDiv.setAttribute("onkeyup", "divToInput(this)");
   lessonTitleTextInputDiv.setAttribute("onkeydown", "divToInput(this)");
   lessonSubtitleTextInputDiv.contentEditable = "true";
   lessonSubtitleTextInputDiv.className = "inputDiv contenteditableBr form-control";
   lessonSubtitleTextInputDiv.setAttribute("onkeyup", "divToInput(this)");
   lessonSubtitleTextInputDiv.setAttribute("onkeydown", "divToInput(this)");
   page1ContentTitleTextInputDiv.contentEditable = "true";
   page1ContentTitleTextInputDiv.className = "inputDiv contenteditableBr form-control";
   page1ContentTitleTextInputDiv.setAttribute("onkeyup", "divToInput(this)");
   page1ContentTitleTextInputDiv.setAttribute("onkeydown", "divToInput(this)");
   page1ContentListTextareaDiv.contentEditable = "true";
   page1ContentListTextareaDiv.className = "inputDiv form-control";
   page1ContentListTextareaDiv.setAttribute("onkeyup", "divToInput(this)");
   page1ContentListTextareaDiv.setAttribute("onkeydown", "divToInput(this)");

   $(page1ContentListTextareaDiv).html("<ul><li><br></li></ul>");
   // Prevent backspace
   $(page1ContentListTextareaDiv).keydown(function(e) {
      // trap the return key being pressed
      if (e.keyCode === 8) {
         if ($(this).html() === "<ul><li><br></li></ul>") {
            // prevent the default behaviour of return key pressed
            return false;
         }
      }
   });

   let colourTemplateJson = JSON.parse(colourTemplate);
   $(lessonTitleTextInput).css("display", "none"); // Hiding real input
   $(lessonSubtitleTextInput).css("display", "none"); // Hiding real input
   $(lessonSubtitleColorInput).css("display", "none"); // Hiding real input
   $(leftDivColorInput).css("display", "none"); // Hiding real input
   leftDivColorInput.value = colourTemplateJson["Lecture"];
   $(page1ContentTitleTextInput).css("display", "none"); // Hiding real input
   $(page1ContentListTextarea).css("display", "none"); // Hiding real input

   lessonTitleP.appendChild(document.createTextNode("Lesson Title"));
   lessonSubtitleP.appendChild(document.createTextNode("Subtitle Title"));
   lessonSection.appendChild(lessonTitleP);
   lessonSection.appendChild(lessonTitleTextInputDiv);
   lessonSection.appendChild(lessonTitleTextInput);
   lessonSection.appendChild(lessonSubtitleP);
   lessonSection.appendChild(lessonSubtitleTextInputDiv);
   lessonSection.appendChild(lessonSubtitleTextInput);
   lessonSection.appendChild(lessonSubtitleColorInput);

   // Creating options for select (Dropdown)
   let lectureL = document.createElement("option");
   lectureL.appendChild(document.createTextNode("Lecture"));
   lectureL.setAttribute("value", "Lecture");
   let practicalP = document.createElement("option");
   practicalP.appendChild(document.createTextNode("Practical"));
   practicalP.setAttribute("value", "Practical");
   let tutorialT = document.createElement("option");
   tutorialT.appendChild(document.createTextNode("Tutorial"));
   tutorialT.setAttribute("value", "Tutorial");
   let remarkR = document.createElement("option");
   remarkR.appendChild(document.createTextNode("Remark"));
   remarkR.setAttribute("value", "Remark");
   let eLearningE = document.createElement("option");
   eLearningE.appendChild(document.createTextNode("E-Learning"));
   eLearningE.setAttribute("value", "E-Learning");
   let inCourseAssICA = document.createElement("option");
   inCourseAssICA.appendChild(document.createTextNode("In Course Assessment"));
   inCourseAssICA.setAttribute("value", "In Course Assessment");
   leftDivTextInput.appendChild(lectureL);
   leftDivTextInput.appendChild(practicalP);
   leftDivTextInput.appendChild(tutorialT);
   leftDivTextInput.appendChild(remarkR);
   leftDivTextInput.appendChild(eLearningE);
   leftDivTextInput.appendChild(inCourseAssICA);

   leftDivP.appendChild(document.createTextNode("Lesson/ICA Type"));
   leftDiv.appendChild(leftDivP);
   leftDiv.appendChild(leftDivTextInput);
   leftDiv.appendChild(leftDivColorInput);

   page1ContentTitle.appendChild(document.createTextNode("Title"));
   page1ContentList.appendChild(document.createTextNode("Topics"));
   page1Content.appendChild(page1ContentTitle);
   page1Content.appendChild(page1ContentTitleTextInputDiv);
   page1Content.appendChild(page1ContentTitleTextInput);
   page1Content.appendChild(page1ContentList);
   page1Content.appendChild(page1ContentListTextareaDiv);
   page1Content.appendChild(page1ContentListTextarea);
   rightDiv.appendChild(page1Content);

   closeImg.appendChild(closeImgImage);

   contentDivDivRight.appendChild(leftDiv);
   contentDivDivRight.appendChild(rightDiv);
   contentDivDiv.appendChild(contentDivDivDraggableDiv);
   contentDivDiv.appendChild(contentDivDivRight);
   contentDivDiv.appendChild(closeImg);

   addLessonContent.appendChild(addLessonContentImg);
   addLessonContent.appendChild(addLessonContentP);
   closeImg2.appendChild(closeImgImage2);

   mainSection.appendChild(lessonSection);
   mainSection.appendChild(contentDivDiv);
   mainSection.appendChild(addLessonContent);
   mainSection.appendChild(closeImg2);

   $(addSectionDiv).before(mainSection);

   // Showing all input and Textarea if notClicked
   if (!notClicked) {
      $(".inputDiv").next().css("display", "block");
      $("textarea").css("display", "block");
      $(".showAllInput").css("display", "block");
   }

   // Prevent creating div on enter
   contentEditableBr();

   // Rebuilt Page2
   recreatePage2();

   // Making items sortable
   makeSortable();
}

function recreatePage1() {
   // Clear page 1
   $("#page1").empty();

   // Page 1 Section
   let page1Section = document.createElement("div");
   // Title
   let page1TitleP = document.createElement("p");
   page1TitleP.appendChild(document.createTextNode("Instructors Details"));
   page1TitleP.className = "bold underline";

   // Paragraph
   //let page1ParagraphP = document.createElement("p");
   //page1ParagraphP.appendChild(document.createTextNode("Paragraph"));

   let page1ParagraphTextareaDiv = document.createElement("div");
   page1ParagraphTextareaDiv.contentEditable = "true";
   page1ParagraphTextareaDiv.className = "inputDiv form-control";
   page1ParagraphTextareaDiv.setAttribute("onkeyup", "divToInput(this)");
   page1ParagraphTextareaDiv.setAttribute("onkeydown", "divToInput(this)");
   let page1ParagraphTextarea = document.createElement("textarea");
   page1ParagraphTextarea.id = "paragraphTextarea";
   page1ParagraphTextarea.setAttribute("onkeyup", "inputToDiv(this)");
   page1ParagraphTextarea.setAttribute("onkeydown", "inputToDiv(this)");
   $(page1ParagraphTextarea).css("display", "none"); // Hiding real input

   // -- Paragraph --
   // Div
   let paragraphInput = $("#page2 > #lessonPlanTemplate > #instructorsDetails").html().trim().replace(/\t/g, "");
   $(page1ParagraphTextareaDiv).html(paragraphInput);

   // Prevent backspace
   $(page1ParagraphTextareaDiv).keydown(function(e) {
      // trap the return key being pressed
      if (e.keyCode === 8) {
         if ($(this).html() === "<p><br></p>") {
            // prevent the default behaviour of return key pressed
            return false;
         }
      }
   });

   $(page1ParagraphTextarea).val(paragraphInput);

   // Appending Title and paragraph
   page1Section.appendChild(page1TitleP);
   //page1Section.appendChild(page1ParagraphP);
   page1Section.appendChild(page1ParagraphTextareaDiv);
   page1Section.appendChild(page1ParagraphTextarea);

   // Page1 append section
   $("#page1").append(page1Section);

   // Main Section
   $(".lesson").each(function() {
      // Creating mainSection
      let mainSection = document.createElement("div");
      mainSection.className = "mainSection section";

      // Creating lessonTitle section
      let lessonSection = document.createElement("div");
      lessonSection.className = "lessonTitle";

      // Creating Lesson Title
      let lessonTitleP = document.createElement("p");
      lessonTitleP.appendChild(document.createTextNode("Lesson Title"));
      let lessonTitleTextInputDiv = document.createElement("div");
      lessonTitleTextInputDiv.contentEditable = "true";
      lessonTitleTextInputDiv.className = "inputDiv contenteditableBr form-control";
      lessonTitleTextInputDiv.setAttribute("onkeyup", "divToInput(this)");
      lessonTitleTextInputDiv.setAttribute("onkeydown", "divToInput(this)");
      let lessonTitleTextInput = document.createElement("input");
      lessonTitleTextInput.setAttribute("onkeyup", "inputToDiv(this)");
      lessonTitleTextInput.setAttribute("onkeydown", "inputToDiv(this)");
      lessonTitleTextInput.className = "lessonTitleInput form-control";
      $(lessonTitleTextInputDiv).html($(this).find(".lessonHeader").children().eq(0).html());
      $(lessonTitleTextInput).val($(this).find(".lessonHeader").children().eq(0).html());
      $(lessonTitleTextInput).css("display", "none"); // Hiding real input

      // Creating Lesson Subtitle
      let lessonSubtitleP = document.createElement("p");
      lessonSubtitleP.appendChild(document.createTextNode("Lesson Subtitle"));
      let lessonSubtitleTextInputDiv = document.createElement("div");
      lessonSubtitleTextInputDiv.contentEditable = "true";
      lessonSubtitleTextInputDiv.className = "inputDiv contenteditableBr form-control";
      lessonSubtitleTextInputDiv.setAttribute("onkeyup", "divToInput(this)");
      lessonSubtitleTextInputDiv.setAttribute("onkeydown", "divToInput(this)");
      let lessonSubtitleTextInput = document.createElement("input");
      lessonSubtitleTextInput.setAttribute("onkeyup", "inputToDiv(this)");
      lessonSubtitleTextInput.setAttribute("onkeydown", "inputToDiv(this)");
      lessonSubtitleTextInput.className = "lessonSubtitleInput form-control";
      $(lessonSubtitleTextInputDiv).html($(this).find(".lessonHeader").children().eq(1).html());
      $(lessonSubtitleTextInput).val($(this).find(".lessonHeader").children().eq(1).text());
      $(lessonSubtitleTextInput).css("display", "none"); // Hiding real input

      // Lesson color
      let lessonSubtitleColorInput = document.createElement("input");
      lessonSubtitleColorInput.setAttribute("onchange", "setActualValue()");
      lessonSubtitleColorInput.setAttribute("type", "color");
      lessonSubtitleColorInput.className = "form-control showAllInput";
      $(lessonSubtitleColorInput).css("display", "none"); // Hiding real input
      let lessonSubtitleColorInputColor = $(this).find(".lessonHeader").css("background-color");
      $(lessonSubtitleColorInput).val(rgb2hex(lessonSubtitleColorInputColor));

      // Appending lessonTitle
      lessonSection.appendChild(lessonTitleP);
      lessonSection.appendChild(lessonTitleTextInputDiv);
      lessonSection.appendChild(lessonTitleTextInput);
      lessonSection.appendChild(lessonSubtitleP);
      lessonSection.appendChild(lessonSubtitleTextInputDiv);
      lessonSection.appendChild(lessonSubtitleTextInput);
      lessonSection.appendChild(lessonSubtitleColorInput);

      mainSection.appendChild(lessonSection);

      // ContentDivDiv
      $(this).find(".lecPracHeader").each(function() {
         // Creating contentDivDiv
         let contentDivDiv = document.createElement("div");
         contentDivDiv.className = "section contentDivDiv";

         // Creating contentDivDivDraggableDiv
         let contentDivDivDraggableDiv = document.createElement("div");
         contentDivDivDraggableDiv.className = "contentDivDivDraggableDiv progress-bar-striped bg-success";
         contentDivDivDraggableDiv.style.opacity = "0";

         // Creating contentDivDivRight
         let contentDivDivRight = document.createElement("div");
         contentDivDivRight.className = "contentDivDivRight";

         // Creating leftDiv
         let leftDiv = document.createElement("div");
         leftDiv.className = "leftDiv";

         // Creating Lesson/ICA Type
         let leftDivP = document.createElement("p");
         leftDivP.appendChild(document.createTextNode("Lesson/ICA Type"));
         // Lesson/ICA Type
         let leftDivTextInput = document.createElement("select");
         leftDivTextInput.setAttribute("onchange", "setActualColour(this)");
         leftDivTextInput.className = "inputDiv custom-select";
         // Lecture select options
         let lectureL = document.createElement("option");
         lectureL.appendChild(document.createTextNode("Lecture"));
         lectureL.setAttribute("value", "Lecture");
         let practicalP = document.createElement("option");
         practicalP.appendChild(document.createTextNode("Practical"));
         practicalP.setAttribute("value", "Practical");
         let tutorialT = document.createElement("option");
         tutorialT.appendChild(document.createTextNode("Tutorial"));
         tutorialT.setAttribute("value", "Tutorial");
         let remarkR = document.createElement("option");
         remarkR.appendChild(document.createTextNode("Remark"));
         remarkR.setAttribute("value", "Remark");
         let eLearningE = document.createElement("option");
         eLearningE.appendChild(document.createTextNode("E-Learning"));
         eLearningE.setAttribute("value", "E-Learning");
         let inCourseAssICA = document.createElement("option");
         inCourseAssICA.appendChild(document.createTextNode("In Course Assessment"));
         inCourseAssICA.setAttribute("value", "In Course Assessment");
         leftDivTextInput.appendChild(lectureL);
         leftDivTextInput.appendChild(practicalP);
         leftDivTextInput.appendChild(tutorialT);
         leftDivTextInput.appendChild(remarkR);
         leftDivTextInput.appendChild(eLearningE);
         leftDivTextInput.appendChild(inCourseAssICA);
         $(leftDivTextInput).val($(this).find(".lecPracDiv :first-child").text());
         // Lecture Color
         let leftDivColorInput = document.createElement("input");
         leftDivColorInput.setAttribute("onchange", "setActualValue()");
         leftDivColorInput.setAttribute("type", "color");
         leftDivColorInput.className = "form-control";
         $(leftDivColorInput).css("display", "none"); // Hiding real input
         let lecPracDivColor = $(this).find(".lecPracDiv").css("background-color");
         $(leftDivColorInput).val(rgb2hex(lecPracDivColor));

         // Appending leftDiv
         leftDiv.appendChild(leftDivP);
         leftDiv.appendChild(leftDivTextInput);
         leftDiv.appendChild(leftDivColorInput);

         // Creating rightDiv
         let rightDiv = document.createElement("div");
         rightDiv.className = "flex rightDiv";

         // Creating page1Content
         let page1Content = document.createElement("div");
         page1Content.className = "page1Content";

         // page1Content Title
         let page1ContentTitle = document.createElement("p");
         page1ContentTitle.appendChild(document.createTextNode("Title"));
         // page1Input
         let page1ContentTitleTextInputDiv = document.createElement("div");
         page1ContentTitleTextInputDiv.contentEditable = "true";
         page1ContentTitleTextInputDiv.className = "inputDiv contenteditableBr form-control";
         page1ContentTitleTextInputDiv.setAttribute("onkeyup", "divToInput(this)");
         page1ContentTitleTextInputDiv.setAttribute("onkeydown", "divToInput(this)");
         let page1ContentTitleTextInput = document.createElement("input");
         page1ContentTitleTextInput.setAttribute("onkeyup", "inputToDiv(this)");
         page1ContentTitleTextInput.setAttribute("onkeydown", "inputToDiv(this))");
         page1ContentTitleTextInput.setAttribute("type", "text");
         $(page1ContentTitleTextInputDiv).html($(this).find(".lessonPlanContent .lessonPlanContentP").html());
         $(page1ContentTitleTextInput).val($(this).find(".lessonPlanContent .lessonPlanContentP").html());
         $(page1ContentTitleTextInput).css("display", "none"); // Hiding real input

         // page1Content Topics
         let page1ContentList = document.createElement("p");
         page1ContentList.appendChild(document.createTextNode("Topics"));
         // page1Content Textarea
         let page1ContentListTextareaDiv = document.createElement("div");
         page1ContentListTextareaDiv.contentEditable = "true";
         page1ContentListTextareaDiv.className = "inputDiv form-control";
         page1ContentListTextareaDiv.setAttribute("onkeyup", "divToInput(this)");
         page1ContentListTextareaDiv.setAttribute("onkeydown", "divToInput(this)");
         let page1ContentListTextarea = document.createElement("textarea");
         page1ContentListTextarea.setAttribute("onkeyup", "inputToDiv(this)");
         page1ContentListTextarea.setAttribute("onkeydown", "inputToDiv(this)");
         $(page1ContentListTextarea).css("display", "none"); // Hiding real input
         // Topics
         let lessonContentText = $(this).find(".lessonPlanContent ul")[0].outerHTML.trim().replace(/\t/g, "");
         $(page1ContentListTextareaDiv).html(lessonContentText);
         $(page1ContentListTextarea).val(lessonContentText);

         // Prevent backspace
         $(page1ContentListTextareaDiv).keydown(function(e) {
            // trap the return key being pressed
            if (e.keyCode === 8) {
               if ($(this).html() === "<ul><li><br></li></ul>") {
                  // prevent the default behaviour of return key pressed
                  return false;
               }
            }
         });

         // Appending rightDiv
         page1Content.appendChild(page1ContentTitle);
         page1Content.appendChild(page1ContentTitleTextInputDiv);
         page1Content.appendChild(page1ContentTitleTextInput);
         page1Content.appendChild(page1ContentList);
         page1Content.appendChild(page1ContentListTextareaDiv);
         page1Content.appendChild(page1ContentListTextarea);
         rightDiv.appendChild(page1Content);

         // Creating closeImg
         let closeImg = document.createElement("button");
         closeImg.className = "closeImg close";
         closeImg.setAttribute("onclick", "removeLessonContent(this)");
         closeImg.setAttribute("type", "button");
         closeImg.setAttribute("aria-label", "Close");
         let closeImgImage = document.createElement("span");
         closeImgImage.setAttribute("aria-hidden", "true");
         closeImgImage.innerHTML = "&times;";

         // Appending closeImg
         closeImg.appendChild(closeImgImage);

         // Appending everything
         contentDivDivRight.appendChild(leftDiv);
         contentDivDivRight.appendChild(rightDiv);
         contentDivDiv.appendChild(contentDivDivDraggableDiv);
         contentDivDiv.appendChild(contentDivDivRight);
         contentDivDiv.appendChild(closeImg);

         // Appending contentDivDiv
         mainSection.appendChild(contentDivDiv);
      });

      // Creating closeImg for entire section / "lesson"
      let addLessonContent = document.createElement("div");
      addLessonContent.className = "addLessonContent";
      let addLessonContentP = document.createElement("p");
      addLessonContentP.appendChild(document.createTextNode("Add New Lesson/ICA"));
      let addLessonContentCloseImgImage = document.createElement("i");

      let closeImg2 = document.createElement("button");
      closeImg2.className = "closeImg close";
      let closeImgImage2 = document.createElement("span");

      // Setting attributes
      addLessonContent.setAttribute("onclick", "addLessonContent(this)");
      addLessonContentCloseImgImage.className = "fas fa-plus-circle";

      closeImg2.setAttribute("onclick", "removeLessonContent(this)");
      closeImg2.setAttribute("type", "button");
      closeImg2.setAttribute("aria-label", "Close");
      closeImgImage2.setAttribute("aria-hidden", "true");
      closeImgImage2.innerHTML = "&times;";

      closeImg2.appendChild(closeImgImage2);
      addLessonContent.appendChild(addLessonContentCloseImgImage);
      addLessonContent.appendChild(addLessonContentP);

      // Appending Section close and add
      mainSection.appendChild(addLessonContent);
      mainSection.appendChild(closeImg2);

      // Page1 append mainSection
      $("#page1").append(mainSection);
   });

   // Add lesson Section
   let addLessonSection = document.createElement("div");
   let addLessonSectionImg = document.createElement("i");
   let addLessonSectionP = document.createElement("p");
   addLessonSection.id = "addLessonSection";
   addLessonSection.className = "addLessonContent";
   addLessonSection.setAttribute("onclick", "addLessonSection(this)");
   addLessonSection.style.color = "white";
   addLessonSectionImg.className = "fas fa-plus-circle";

   // Appending Add Lesson
   addLessonSectionP.appendChild(document.createTextNode("Add New Lesson"));
   addLessonSection.appendChild(addLessonSectionImg);
   addLessonSection.appendChild(addLessonSectionP);

   // Footer Section
   let footerSection = document.createElement("div");
   footerSection.className = "footerSection";
   let footerP = document.createElement("p");
   footerP.appendChild(document.createTextNode("Footnote"));
   let footerTextInputDiv = document.createElement("div");
   footerTextInputDiv.contentEditable = "true";
   footerTextInputDiv.className = "inputDiv contenteditableBr form-control";
   footerTextInputDiv.setAttribute("onkeyup", "divToInput(this)");
   footerTextInputDiv.setAttribute("onkeydown", "divToInput(this)");
   let footerTextInput = document.createElement("input");
   footerTextInput.setAttribute("type", "text");
   footerTextInput.setAttribute("onkeyup", "inputToDiv(this)");
   footerTextInput.setAttribute("onkeydown", "inputToDiv(this)");
   footerTextInput.id = "lessonPlanFooter";
   $(footerTextInputDiv).html($("#lessonPlanTemplate .sub").html());
   $(footerTextInput).val($("#lessonPlanTemplate .sub").html());
   $(footerTextInput).css("display", "none"); // Hiding real input

   // Appending Footer
   footerSection.appendChild(footerP);
   footerSection.appendChild(footerTextInputDiv);
   footerSection.appendChild(footerTextInput);

   // Adding br
   let buttonBr = document.createElement("br");

   let buttonsDiv = document.createElement("div");
   buttonsDiv.style.display = "flex";
   buttonsDiv.style.flexDirection = "column";

   // Generate Button
   let generateHTMLButton = document.createElement("button");
   generateHTMLButton.appendChild(document.createTextNode("Generate HTML for BlackBoard"));
   generateHTMLButton.setAttribute("onclick", "generateHTML()");
   generateHTMLButton.className = "btn btn-primary";

   // Save HTML Button
   let saveHTMLButton = document.createElement("button");
   saveHTMLButton.appendChild(document.createTextNode("Save As HTML (For Reimport)"));
   saveHTMLButton.setAttribute("onclick", "saveHTMLFile()");
   saveHTMLButton.className = "btn btn-secondary";

   // Show all input
   let showAllButton = document.createElement("button");
   showAllButton.appendChild(document.createTextNode("Show All Hidden HTML"));
   showAllButton.setAttribute("onclick", "showAllInput(this)");
   showAllButton.className = "btn btn-secondary";

   // Appending Everything
   buttonsDiv.appendChild(generateHTMLButton);
   buttonsDiv.appendChild(saveHTMLButton);
   buttonsDiv.appendChild(showAllButton);

   let page1 = document.getElementById("page1");
   page1.appendChild(addLessonSection);
   page1.appendChild(footerSection);
   page1.appendChild(buttonBr);
   page1.appendChild(buttonsDiv);

   // Prevent creating div on enter
   contentEditableBr();

   // Making items sortable
   makeSortable();
}

function recreatePage2() {
   // Clear #Page2
   $("#page2").empty();

   // LessonPlanTemplate
   let lessonPlanTemplate = document.createElement("div");
   lessonPlanTemplate.id = "lessonPlanTemplate";

   // Instructors
   let instructors = document.createElement("p");
   instructors.appendChild(document.createTextNode("Instructors Details"));
   // Instructors Details
   let instructorsDetails = document.createElement("div");
   // Loop details to add
   let instructorDetailsValue = $("#paragraphTextarea").val();
   $(instructorsDetails).html(instructorDetailsValue);

   // Adding all classes
   instructors.className = "bold underline";
   instructorsDetails.id = "instructorsDetails";

   // Appending Everything
   lessonPlanTemplate.append(instructors);
   lessonPlanTemplate.append(instructorsDetails);

   // Loop MainSection
   $(".mainSection").each(function() {
      // Create Lesson
      let lesson = document.createElement("div");
      let lessonHeader = document.createElement("div");
      lessonHeader.style.backgroundColor = $(this).find(".lessonTitle > :last-child").val();
      // Lesson Title
      let lessonTitle = document.createElement("p");
      $(lessonTitle).html($(this).find(".lessonTitleInput").val());
      // Lesson Subtitle
      let lessonSubtitle = document.createElement("p");
      $(lessonSubtitle).html($(this).find(".lessonSubtitleInput").val());

      // Adding all classes
      lesson.className = "lesson";
      lessonHeader.className = "lessonHeader";
      lessonTitle.className = "bold";
      lessonSubtitle.className = "em";

      // Appending Lesson header before loop
      lessonHeader.appendChild(lessonTitle);
      lessonHeader.appendChild(lessonSubtitle);
      lesson.appendChild(lessonHeader);

      // Loop All LecPracheader
      $(this).find(".contentDivDiv").each(function() {
         // lesPracHeader
         let lecPracHeader = document.createElement("div");
         // LecPracDiv
         let lecPracDiv = document.createElement("div");
         let lecPracDivP = document.createElement("p");
         $(lecPracDiv).css("background-color", $(this).find(".leftDiv input").val());
         $(lecPracDivP).html($(this).find(".leftDiv :nth-child(2)").val());
         lecPracDiv.appendChild(lecPracDivP);
         // Lesson Plan Content
         let lessonPlanContent = document.createElement("div");
         // Lesson Plan Title
         let lessonPlanContentTitleP = document.createElement("p");
         $(lessonPlanContentTitleP).html($(this).find(".rightDiv .page1Content .inputDiv").eq(0).html());
         // Lesson Plan Topics
         let lines = $(this).find(".rightDiv .page1Content .inputDiv").eq(1).html();
         $(lessonPlanContent).html(lines);

         // Adding all classes
         lecPracHeader.className = "lecPracHeader";
         lecPracDiv.className = "lecPracDiv";
         lecPracDivP.className = "bold";
         lessonPlanContent.className = "lessonPlanContent";
         lessonPlanContentTitleP.className = "lessonPlanContentP";

         // Appending Everything
         $(lessonPlanContent).prepend(lessonPlanContentTitleP);
         lecPracHeader.appendChild(lecPracDiv);
         lecPracHeader.appendChild(lessonPlanContent);

         // Appending to lesson
         lesson.appendChild(lecPracHeader);
      });

      // Appending lesson to Page2
      lessonPlanTemplate.append(lesson);
   });

   // Footer
   let lessonPlanFooter = document.createElement("p");
   $(lessonPlanFooter).html($("#lessonPlanFooter").val());

   // Adding all classes
   lessonPlanFooter.className = "sub";

   // Appending Footer
   lessonPlanTemplate.append(lessonPlanFooter);

   // Appending lessonPlanTemplate to Page2
   $("#page2").append(lessonPlanTemplate);
}

function setInputValue() {
   recreatePage1();
}

function setActualValue() {
   recreatePage2();
}

function setActualColour(dropdownInput) {
   let dropdownValue = dropdownInput.value;
   let colourTemplateJson = JSON.parse(colourTemplate);
   if (colourTemplateJson[dropdownValue]) {
      $(dropdownInput).next().val(colourTemplateJson[dropdownValue]);
   }
   recreatePage2();
}

function generateHTML() {
   $("#popupDiv").modal("show");
   let popupOutputHTML = "<p><link rel='stylesheet' href='https://mlearnnypsit.github.io/css/Blackboard.min.css' /></p><meta name='viewport' content='width=device-width, initial-scale=1.0' />" + $("#page2").html().trim();
   $("#popup .modal-body textarea").val(popupOutputHTML);
}

function closePopup() {
   $("#popupDiv").modal("hide");
   $("#popup .generateHTMLRedText").css("display", "none"); // Hide after showing
}

function copyToClipboard() {
   $("#popup .modal-body textarea")[0].select();
   document.execCommand("copy");
   $("#popup .generateHTMLRedText").css("display", "block"); // Show after clicked
}

function copyCommand() {
   let tempText = document.createElement("textarea");
   $(tempText).text(selectedText);
   $("#masterDiv").append(tempText);
   $(tempText)[0].select();
   document.execCommand("copy");
   $(tempText).remove();
}

function checkOverlapLink(selectedText) {
   let selectedTextBackup = htmlEncode(selectedText);
   let inputElement = focusedInput;
   startIndex = inputElement.next().val().indexOf(selectedTextBackup);
   let regexSearch1 = escape("<a href=");
   let regexSearch2 = escape("</a>");
   let regExp = new RegExp("(" + regexSearch1 + ").*(" + escape(selectedTextBackup) + ").*(" + regexSearch2 + ")");
   if (!regExp.test(escape(inputElement.next().val()))) {
      if (startIndex !== -1) {
         return true;
      } else {
         alert("Error! Make sure the text selected is not overlapping with another link.");
         return false;
      }
   } else {
      alert("Error! You already made this a link.");
      return false;
   }
}

function promptLink() {
   if (selectedText.length > 0 && checkOverlapLink(selectedText)) {
      $("#linkInput").val("https://");
      $("#linkBoxOptions").text("Webpage");
      $("#linkBoxDiv").modal("show");
   }
}

function hideLinkBox() {
   $("#linkBoxDiv").modal("hide");

   // Make sure Webpage is still default
   changeInputBoxSelection(1);
}

function hideExcelBox() {
   $("#excelSelectInput").removeClass("is-invalid");
   $("#excelSelectInput").removeClass("is-valid");
   $("#inputGroupFile01").val(null);
   $("#uploadedFileName").html("Choose file");
   $("#excelBoxDiv").modal("hide");
}

function changeInputBoxSelection(number) {
   // Remove active class
   $(".dropdown-menu > .active.dropdown-item")[0].classList.remove("active");

   let dropdownDiv = $("#linkBoxOptions");
   let linkInput = $("#linkInput");
   switch (number) {
      case 1:
         dropdownDiv.text("Webpage");
         linkInput[0].setAttribute("placeholder", "https://");
         linkInput.val("https://");
         $(".dropdown-menu > a:first-child")[0].classList.add("active");
         break;
      case 2:
         dropdownDiv.text("Email");
         linkInput[0].setAttribute("placeholder", "example@nyp.edu.sg");
         linkInput.val("");
         let emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
         if (emailRegex.test(selectedText)) {
            linkInput.val(htmlEncode(selectedText));
         }
         $(".dropdown-menu > a:nth-child(2)")[0].classList.add("active");
         break;
      case 3:
         dropdownDiv.text("Javascript");
         linkInput[0].setAttribute("placeholder", "alert('Hello')");
         linkInput.val("");
         $(".dropdown-menu > a:nth-child(4)")[0].classList.add("active");
         break;
   }
}

function checkAndDisplayAlert() {
   if ($("#linkInput").val()) {
      // Creating alert
      let alertBox = document.createElement("div");
      alertBox.className = "alert alert-warning fade show";
      alertBox.id = "linkBoxAlertError";
      alertBox.setAttribute("role", "alert");
      let alertBoxP = document.createElement("p");
      let alertBoxButtonDiv = document.createElement("div");
      let alertBoxButtonDivButton = document.createElement("button");
      alertBoxButtonDivButton.className = "close";
      alertBoxButtonDivButton.setAttribute("type", "button");
      alertBoxButtonDivButton.setAttribute("data-dismiss", "alert");
      alertBoxButtonDivButton.setAttribute("aria-label", "Close");
      let alertBoxButtonDivButtonSpan = document.createElement("span");
      alertBoxButtonDivButton.setAttribute("aria-hidden", "true");
      alertBoxButtonDivButton.innerHTML = "&times;";
      // Appending alert
      alertBoxButtonDivButton.appendChild(alertBoxButtonDivButtonSpan);
      alertBoxButtonDiv.appendChild(alertBoxButtonDivButton);
      alertBox.appendChild(alertBoxP);
      alertBox.appendChild(alertBoxButtonDiv);

      // Checking value
      let inputValue = $("#linkInput").val();
      let dropdownDivText = $("#linkBoxOptions").text();
      if (dropdownDivText === "Webpage") {
         let urlRegex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/;

         // If entered text doesnt match url regex, ask for confirmation
         if (!urlRegex.test(inputValue)) {
            closeAlert();
            alertBoxP.appendChild(document.createTextNode("The URL entered does not match the format."));
            $("#linkBox > .modal-content > .modal-body").prepend(alertBox);
         } else {
            closeAlert();
         }
      } else if (dropdownDivText === "Email") {
         let emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

         if (!emailRegex.test(inputValue)) {
            closeAlert();
            alertBoxP.appendChild(document.createTextNode("The email entered does not match the format."));
            $("#linkBox > .modal-content > .modal-body").prepend(alertBox);
         } else {
            closeAlert();
         }
      }
   }
}

function whichLinkSelection() {
   let dropdownDivText = $("#linkBoxOptions").text();
   if (dropdownDivText === "Webpage") {
      return "";
   } else if (dropdownDivText === "Email") {
      return "mailto:";
   } else if (dropdownDivText === "Javascript") {
      return "javascript:";
   } else {
      alert("Unexpected error");
      return null;
   }
}

function convertToLink() {
   closeAlert();
   // Creating alert
   let alertBox = document.createElement("div");
   alertBox.className = "alert alert-danger fade show";
   alertBox.id = "linkBoxAlertError";
   alertBox.setAttribute("role", "alert");
   let alertBoxP = document.createElement("p");
   let alertBoxButtonDiv = document.createElement("div");
   let alertBoxButtonDivButton = document.createElement("button");
   alertBoxButtonDivButton.className = "close";
   alertBoxButtonDivButton.setAttribute("type", "button");
   alertBoxButtonDivButton.setAttribute("data-dismiss", "alert");
   alertBoxButtonDivButton.setAttribute("aria-label", "Close");
   let alertBoxButtonDivButtonSpan = document.createElement("span");
   alertBoxButtonDivButton.setAttribute("aria-hidden", "true");
   alertBoxButtonDivButton.innerHTML = "&times;";
   // Appending alert
   alertBoxButtonDivButton.appendChild(alertBoxButtonDivButtonSpan);
   alertBoxButtonDiv.appendChild(alertBoxButtonDivButton);
   alertBox.appendChild(alertBoxP);
   alertBox.appendChild(alertBoxButtonDiv);

   let linkEntered = $("#linkInput").val();
   // Checking input is not empty
   if (linkEntered) {
      // Checking if text matches url regex
      if (whichLinkSelection() === "") {
         let urlRegex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/;

         // If entered text doesnt match url regex, ask for confirmation
         if (!urlRegex.test(linkEntered) && !confirm("The URL entered does not match the format. Do you want to continue?")) {
            alertBoxP.appendChild(document.createTextNode("The URL entered does not match the format."));
            alertBox.className = "alert alert-warning fade show";
            $("#linkBox > .modal-content > .modal-body").prepend(alertBox);
            // Break if "Doesnt Match" and "Cancel"
            return false;
         }
      } else if (whichLinkSelection() === "mailto:") {
         let emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

         if (!emailRegex.test(selectedText) && !confirm("The email entered does not match the format. Do you want to continue?")) {
            alertBoxP.appendChild(document.createTextNode("The email entered does not match the format."));
            alertBox.className = "alert alert-warning fade show";
            $("#linkBox > .modal-content > .modal-body").prepend(alertBox);
            // Break if "Doesnt Match" and "Cancel"
            return false;
         }
      }
      let selectedTextBackup = htmlEncode(selectedText);
      let inputElement = focusedInput;
      let inputValue = inputElement.html();
      let linkA = "";
      if (whichLinkSelection()) {
         linkA = "<a href='" + whichLinkSelection() + $("#linkInput").val() + "' target='_blank'>" + selectedTextBackup + "</a>";
      } else {
         linkA = "<a href='" + $("#linkInput").val() + "' target='_blank'>" + selectedTextBackup + "</a>";
      }

      // Overriding previous startIndex. It doesnt work with multi-line div
      startIndex = inputElement.next().val().indexOf(selectedTextBackup);

      // Make sure the text is not already a link
      let regexSearch1 = escape("<a href=");
      let regexSearch2 = escape("</a>");
      let regExp = new RegExp("(" + regexSearch1 + ").*(" + escape(selectedTextBackup) + ").*(" + regexSearch2 + ")");
      if (!regExp.test(escape(inputElement.next().val()))) {
         if (startIndex !== -1) {
            // Replacing the html in input
            let beforeLink = inputValue.substring(0, startIndex);
            let afterLink = inputValue.substring(startIndex + selectedTextBackup.length);
            let finalLink = beforeLink + linkA + afterLink;
            focusedInput.next().val(finalLink);

            // Refresh div
            focusedInput.html(focusedInput.next().val());

            setActualValue();
         } else {
            alertBoxP.appendChild(document.createTextNode("Error! Make sure the text selected is not overlapping with another link."));
            $("#linkBox > .modal-content > .modal-body").prepend(alertBox);
         }
      } else {
         alertBoxP.appendChild(document.createTextNode("Error! You already made this a link."));
         $("#linkBox > .modal-content > .modal-body").prepend(alertBox);
      }

      hideLinkBox();
   } else {
      alertBoxP.appendChild(document.createTextNode("Please enter a link."));
      $("#linkBox > .modal-content > .modal-body").prepend(alertBox);
   }
}

function divToInput(div) {
   $(div).next().val(div.innerHTML);
   setActualValue();
}

function inputToDiv(div) {
   $(div).prev().html(div.value);
   setActualValue();
}

function saveHTMLFile() {
   try {
      var isFileSaverSupported = !!new Blob;

      let fileName = prompt("Please enter filename:", "BlackBoard Lesson Plan");
      if (fileName) {
         let textForSave = document.getElementById("lessonPlanTemplate").outerHTML.toString();
         var blob = new Blob([textForSave], {
            type: "text/html;charset=utf-8"
         });
         saveAs(blob, fileName + ".html");
      }
   } catch (e) {
      let saveFileAlertDivBackground = document.createElement("div");
      saveFileAlertDivBackground.style.position = "fixed";
      saveFileAlertDivBackground.style.top = "0";
      saveFileAlertDivBackground.style.left = "0";
      saveFileAlertDivBackground.style.width = "100%";
      saveFileAlertDivBackground.style.height = "100%";
      saveFileAlertDivBackground.style.backgroundColor = "rgba(25,25,25,0.6)";
      saveFileAlertDivBackground.id = "saveFileAlertBackground";
      let saveFileAlertDiv = document.createElement("div");
      saveFileAlertDiv.className = "alert alert-danger alert-dismissible fade show";
      saveFileAlertDiv.setAttribute("role", "alert");
      saveFileAlertDiv.style.position = "absolute";
      saveFileAlertDiv.style.top = "40%";
      saveFileAlertDiv.style.left = "20%";
      saveFileAlertDiv.style.width = "60%";
      saveFileAlertDiv.style.height = "20%";
      let saveFileAlertP = document.createElement("p");
      saveFileAlertP.innerHTML = "<strong>File saving not supported</strong><br>To save the file, press <kbd><kbd>ctrl</kbd> + <kbd>s</kbd></kbd>"
      let saveFileAlertCloseButton = document.createElement("button");
      saveFileAlertCloseButton.setAttribute("data-dismiss", "alert");
      saveFileAlertCloseButton.setAttribute("aria-label", "close");
      saveFileAlertCloseButton.appendChild(document.createTextNode("Close"));
      saveFileAlertCloseButton.className = "btn btn-primary";
      saveFileAlertCloseButton.onclick = function() {
         $('#saveFileAlertBackground').remove()
      };

      saveFileAlertDiv.appendChild(saveFileAlertP);
      saveFileAlertDiv.appendChild(saveFileAlertCloseButton);
      saveFileAlertDivBackground.appendChild(saveFileAlertDiv);

      $("#masterDiv").append(saveFileAlertDivBackground);
      console.log("Error message: " + e);
   }
}

function showAllInput(button) {
   if (notClicked) {
      $(".inputDiv").next().css("display", "block");
      $("textarea:not(#popup textarea)").css("display", "block");
      $(".showAllInput").css("display", "block");
      button.innerHTML = "Hide All Hidden HTML";
      notClicked = false;
   } else {
      $(".inputDiv").next().css("display", "none");
      $("textarea:not(#popup textarea)").css("display", "none");
      $(".showAllInput").css("display", "none");
      button.innerHTML = "Show All Hidden HTML";
      notClicked = true;
   }
}

function checkImage() {
   for(i=0;i<$("#instructionPageContent > .instructionPageContentContents").length;i++) {
      getInstructionGif(i);
   }
}

function getInstructionGif(index) {
   let img = $("#instructionPageContent > .instructionPageContentContents").eq(index).find("img")[0];
   let img0, img1, img2, img3, img4, img5;

   // Checking screen size
   if($(window).width() > $(window).height()) {
      img0 = "images/LessonPlanGenerator/Desktop/addNewICA.gif";
      img1 = "images/LessonPlanGenerator/Desktop/addNewLesson.gif";
      img2 = "images/LessonPlanGenerator/Desktop/removingLesson.gif";
      img3 = "images/LessonPlanGenerator/Desktop/sorting.gif";
      img4 = "images/LessonPlanGenerator/Desktop/link.gif";
      img5 = "images/LessonPlanGenerator/Desktop/changingColour.gif";
   } else {
      img0 = "images/LessonPlanGenerator/Mobile/M-addNewICA.gif";
      img1 = "images/LessonPlanGenerator/Mobile/M-addNewLesson.gif";
      img2 = "images/LessonPlanGenerator/Mobile/M-removingLesson.gif";
      img3 = "images/LessonPlanGenerator/Mobile/M-sorting.gif";
      img4 = "images/LessonPlanGenerator/Mobile/M-link.gif";
      img5 = "images/LessonPlanGenerator/Mobile/M-changingColour.gif";
   }

   switch(index) {
      case 0:
         img.src = img0;
         break;
      case 1:
         img.src = img1;
         break;
      case 2:
         img.src = img2;
         break;
      case 3:
         img.src = img3;
         break;
      case 4:
         img.src = img4;
         break;
      case 5:
         img.src = img5;
         break;
      default:
         break;
   }
}

function instructionPageButtonDivNext(nextBtn) {
   let instructionPageContentContents = document.getElementById("instructionPageContent").children;
   for (i = 0; i < instructionPageContentContents.length; i++) {
      let current = instructionPageContentContents[i];
      if (i === instructionPageContentContents.length - 2) {
         $(nextBtn).prev().text("Finish");
         $(nextBtn).prev()[0].className = "btn btn-primary";
         $(nextBtn).remove();
      }
      if($(current).css("display") === "block") {
         getInstructionGif(i+1);
         current.style.display = "none";
         instructionPageContentContents[i+1].style.display = "block";
         break;
      }
   }
}

function checkEnterKey(e) {
   // trap the return key being pressed
   if (e.keyCode === 13) {
      // insert 2 br tags (if only one br tag is inserted the cursor won't go to the next line)
      document.execCommand("insertHTML", false, "<br /><br />");
      // prevent the default behaviour of return key pressed
      return false;
   }
}

function contentEditableBr() {
   // Make sure there is only one event attached
   $(document).off("keydown", ".contenteditableBr", checkEnterKey);

   // Prevent creating div on enter
   $(document).on("keydown", ".contenteditableBr", checkEnterKey);
}

function selectAll(popupTextarea) {
   popupTextarea.setSelectionRange(0, popupTextarea.value.length);
}

// Function to convert rgb to hex so can set type=color
let hexDigits = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f"];

// Function to convert rgb color to hex format
function rgb2hex(rgb) {
   rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
   if (!rgb) {
      return "#000000";
   } else {
      return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
   }
}

function hex(x) {
   return isNaN(x) ? "00" : hexDigits[(x - x % 16) / 16] + hexDigits[x % 16];
}

// Encode html
function htmlEncode(value) {
   // Create a in-memory div, set its inner text (which jQuery automatically encodes)
   // Then grab the encoded contents back out. The div never exists on the page.
   return $("<div/>").text(value).html();
}

// Decode html
function htmlDecode(str) {
   return str.replace(/&#(\d+);?/g, function() {
      return String.fromCharCode(arguments[1]);
   });
}
