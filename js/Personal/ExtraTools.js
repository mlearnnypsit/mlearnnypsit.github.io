// For every element you want to have animation, insert id here and set opacity to 0 in the CSS
let elementsArray = [
   "page1TopDivTitle",
   "page1TopDivButtonDiv",
   "page1BottomDivTitle",
   "page1BottomDivSubtitle",
   "page1BottomAccordionTitle",
   "page1BottomAccordionDetails",
   "page1BottomAccordionDetailsExample",
   "page1BottomCardTitle",
   "page1BottomCardDetails",
   "page1BottomCardDetailsExample",
   "page1BottomDivWhyTitle",
   "page1BottomWhyTitle",
   "page1BottomWhyDetails"
];
// Only works if element is in #componentsDiv > *
let excludeInHidden = [
   "#cardIndicatorDiv"
];
// CodeMirror object
let cm;
// Current template selected
let isAccordion;
// To track card current slide
let cardCurrentIndex;
// To track number list index
let numberListIndex;
// Elements to be removed
let selectedAccordionForDeletion, selectedFlashCardForDeletion, selectedChecklistForDeletion, selectedTabForDeletion, selectedNumberListForDeletion;
// Track double click
let latestTap;
// Spinning box
let n = 0,
   isAnimating = !1;
let rotateBox;
// Tooltip expand
let elementsToLoop = ["doubleClickAccordionHelp", "doubleClickTabHelp", "changeColourHelp"];
// Function to convert rgb to hex so can set type=color
let hexDigits = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f"];

$(function () {
   // Random generator for checklist
   sjcl.random.startCollectors();

   require([
      "js/codemirror-5.42.2/lib/codemirror", "js/codemirror-5.42.2/mode/htmlmixed/htmlmixed", "js/codemirror-5.42.2/addon/selection/active-line"
   ], function (CodeMirror) {
      cm = CodeMirror.fromTextArea(document.getElementById("rawTextarea"), {
         styleActiveLine: true,
         matchBrackets: true,
         theme: "shadowfox",
         mode: "htmlmixed"
      });
   });

   $('[data-toggle="popover"]').popover({
      trigger: 'focus'
   });

   // Check if elements need to be animated for page1
   checkElement();

   // Remember to <break;> otherwise will freeze the browser
   // Increase the i < <max> to be "less sensitive"
   $(document).on("click", function (e) {
      let i = 0;
      let nodeYouWant = e.target;
      while (nodeYouWant && i < 4) {
         if (nodeYouWant.className === "accordionDiv") {
            if ($("#removeSelectAccordionHelp").html()) {
               $("#removeSelectAccordionHelp").remove();
               setTimeout(function () {
                  addTooltip("Click on the Trash to remove accordion", "removeHelp", "page2BottomLeftDiv", !1);
                  tooltipShowPositionCheck();
               }, 500);
            }
            selectedAccordionForDeletion = nodeYouWant;
            break;
         } else if (nodeYouWant.className === "cardFlipDiv") {
            if ($("#removeSelectFlashCardHelp").html()) {
               $("#removeSelectFlashCardHelp").remove();
               setTimeout(function () {
                  addTooltip("Click on the Trash to remove checkbox", "removeHelp", "page2BottomLeftDiv", !1);
                  tooltipShowPositionCheck();
               }, 500);
            }
            selectedFlashCardForDeletion = nodeYouWant;
            break;
         } else if (nodeYouWant.className === "checkboxContainer") {
            if ($("#removeCheckboxSelectHelp").html()) {
               $("#removeCheckboxSelectHelp").remove();
               setTimeout(function () {
                  addTooltip("Click on the Trash to remove checkbox", "removeHelp", "page2BottomLeftDiv", !1);
                  tooltipShowPositionCheck();
               }, 500);
            }
            selectedChecklistForDeletion = nodeYouWant;
            break;
         } else if (nodeYouWant.classList && (nodeYouWant.classList.contains("tabComponentLinks") || nodeYouWant.classList.contains("tabComponentContent"))) {
            if ($("#removeTabSelectHelp").html()) {
               $("#removeTabSelectHelp").remove();
               setTimeout(function () {
                  addTooltip("Click on the Trash to remove Tab", "removeHelp", "page2BottomLeftDiv", !1);
                  tooltipShowPositionCheck();
               }, 500);
            }
            selectedTabForDeletion = Array.prototype.indexOf.call(nodeYouWant.parentElement.children, nodeYouWant);
            break;
         } else if (nodeYouWant.className === "fancyNumbers") {
            if ($("#removeListSelectHelp").html()) {
               $("#removeListSelectHelp").remove();
               setTimeout(function () {
                  addTooltip("Click on the Trash to remove Checkbox", "removeHelp", "page2BottomLeftDiv", !1);
                  tooltipShowPositionCheck();
               }, 500);
            }
            selectedNumberListForDeletion = nodeYouWant;
            break;
         } else {
            nodeYouWant = nodeYouWant.parentNode;
            i++;
         }
      }
   });

   $(document).on("keydown", "[contentEditable]", setHiddenHTML);
   $(document).on("keyup", "[contentEditable]", setHiddenHTML);

   $('#importDiv').on('hidden.bs.modal', function (e) {
      document.body.style.overflow = "auto";
   });

   // Animate Trashcan
   $(document).on("click", "#removeSectionButton", function () {
      $(this.children[0]).effect("bounce", "fast");
      removeSection();
   });

   // Animate Ghost
   $(document).on("click", "#hiddenCodesButton", function (event) {
      toggleHiddenCodes();
   });

   $(document).on("click", "#templateSelectionButton", function () {
      showTemplates();
   })

   // Rotate first
   rotateDIV(document.getElementById("templateSelectionButton").children[0]);
});

function rotateDIV(boxIcon) {
   isAnimating = !0;
   clearInterval(rotateBox);
   rotateBox = setInterval(function () {
      n = n + 2;
      boxIcon.style.transform = "rotate(" + n + "deg)"
      boxIcon.style.webkitTransform = "rotate(" + n + "deg)"
      boxIcon.style.OTransform = "rotate(" + n + "deg)"
      boxIcon.style.MozTransform = "rotate(" + n + "deg)"
      if (n === 180 || n === 360) {
         clearInterval(rotateBox);
         if (n == 360) {
            n = 0;
         }
         isAnimating = !1;
      }
   }, 10);
}

function checkElement() {
   for (i = 0; i < elementsArray.length; i++) {
      let element = document.getElementById(elementsArray[i]);
      if ($(element).css("opacity") == 1) {
         continue;
      }
      if ($(window).width() < 425) {
         if (window.pageYOffset >= ($(element).position().top - $(window).height() * 0.9)) {
            animateElement(element);
         }
      } else {
         if (window.pageYOffset >= ($(element).position().top - $(window).height() * 0.7)) {
            animateElement(element);
         }
      }
   }
}

function animateElement(theElement) {
   theElement.style.position = "relative";
   theElement.style.top = "-50px";
   $(theElement).animate({
      opacity: 1,
      top: "0"
   }, 1500);
}

function removeHelp() {
   $(".tooltips").each(function () {
      $(this).fadeOut(function () {
         $(this).remove();
      });
   });
}

function addTooltip(textContent, btnText, destinationID, b) {
   let tooltip = document.createElement("div");
   tooltip.className = "tooltips";
   tooltip.id = btnText;
   let tooltiptext = document.createElement("span");
   tooltiptext.className = "tooltiptext";
   tooltiptext.appendChild(document.createTextNode(textContent));
   let tooltipBottom = document.createElement("div");
   tooltipBottom.className = "tooltipBottom";
   let tooltipBottomBtn = document.createElement("button");
   if (b) {
      tooltipBottomBtn.className = "btn btn-primary";
      tooltipBottomBtn.appendChild(document.createTextNode("Finish"));
      tooltipBottomBtn.style.width = "100%";
   } else {
      tooltipBottomBtn.className = "btn btn-light";
      tooltipBottomBtn.appendChild(document.createTextNode("Skip"));
      let tooltipBottomText = document.createElement("p");
      tooltipBottomText.appendChild(document.createTextNode("Waiting for input..."));
      tooltipBottom.appendChild(tooltipBottomText);
   }
   tooltipBottom.appendChild(tooltipBottomBtn);
   tooltipBottomBtn.setAttribute("onclick", "removeHelp()");
   tooltip.appendChild(tooltiptext);
   tooltip.appendChild(tooltipBottom);
   document.getElementById(destinationID).appendChild(tooltip);
}

function animatePage1Out(show) {
   document.body.scrollTop = 0;
   document.documentElement.scrollTop = 0;
   $("body").css("overflow", "hidden");

   // Add in first tooltip
   if (void 0 == $("#selectTemplateHelp").html() && show) {
      removeHelp();
      setTimeout(function () {
         addTooltip("Select the component you want", "selectTemplateHelp", "templateMainDivLeft", !1);
      }, 1000);
   } else if(!show) {
      // Back to normal
      rotateDIV(document.getElementById("templateSelectionButton").children[0]);
   }

   // Show page2
   let page2 = $("#page2");
   page2.css("display", "flex");
   page2.css("position", "absolute");
   page2.css("top", "0");
   page2.css("left", "0");

   // Hide page1
   let page1 = $("#page1");
   page1.hide("fold", 1200, function () {
      $("body").css("overflow", "auto");
      page1.css("display", "none");

      page2.css("position", "");
      page2.css("top", "");
      page2.css("left", "");

      // Set opacity to 0 Again
      for (i = 0; i < elementsArray.length; i++) {
         let element = document.getElementById(elementsArray[i]);
         if ($(element).css("opacity") == 0) {
            continue;
         }
         element.style.opacity = 0;
      }
   });
}

function animatePage1In() {
   $("body").css("overflow", "hidden");
   cardCurrent = null;
   cardCurrentIndex = 0;
   isAccordion = -1;
   let page2 = $("#page2");
   page2.css("position", "absolute");
   page2.css("top", "0");
   page2.css("left", "0");

   let page1 = $("#page1");
   page1.show("fold", 1200, function () {
      $("body").css("overflow", "auto");
      page2.css("display", "none");
      page2.css("position", "");
      page2.css("top", "");
      page2.css("left", "");
      checkElement();
   });
}

function animatePage2Out() {
   $("body").css("overflow", "hidden");
   // Show page3
   let page3 = $("#page3");
   page3.css("display", "block");
   page3.css("position", "absolute");
   page3.css("top", "0");
   page3.css("left", "0");

   // Hide page2
   let page2 = $("#page2");
   page2.hide("drop", {
      direction: "down"
   }, 1200, function () {
      $("body").css("overflow", "auto");
      page2.css("display", "none");

      page3.css("position", "");
      page3.css("top", "");
      page3.css("left", "");
   });
   // Showing modal got animation delay so starting early
   setTimeout(showPage3Modal, 1000);
}

function animatePage2In() {
   $("body").css("overflow", "hidden");
   // Show page3
   let page3 = $("#page3");
   page3.css("position", "absolute");
   page3.css("top", "0");
   page3.css("left", "0");

   // Hide page2
   let page2 = $("#page2");
   page2.show("drop", {
      direction: "down"
   }, 1200, function () {
      $("body").css("overflow", "auto");
      page3.css("display", "none");
      page3.css("position", "");
      page3.css("top", "");
      page3.css("left", "");
   });
}

function animatePage3Out() {
   $("body").css("overflow", "hidden");
   let page3 = $("#page3");
   page3.css("position", "absolute");
   page3.css("top", "0");
   page3.css("left", "0");

   let page1 = $("#page1");
   page1.show("fold", 1200, function () {
      $("body").css("overflow", "auto");
      page3.css("display", "none");
      page3.css("position", "");
      page3.css("top", "");
      page3.css("left", "");
      checkElement();
   });
}

function createNewButton() {
   // Replace the hidden area with template
   $("#componentsDiv").empty();
   $("#page2TopBarDivTitle > p").text("Title");
   let activeTemplateSelectionLabelDiv = document.getElementsByClassName("templateSelectionLabelDiv active")[0];
   if (activeTemplateSelectionLabelDiv) {
      activeTemplateSelectionLabelDiv.className = "templateSelectionLabelDiv";
   }
   document.getElementById("templateMainDivRight").className = "";
   animatePage1Out(!0);

   let page2BottomLeftDivLeftDiv = document.getElementById("page2BottomLeftDivLeftDiv");
   document.getElementById("hiddenCodeTextarea").style.display = "none";
   document.getElementById("templateMainDiv").style.display = "flex";
   page2BottomLeftDivLeftDiv.className = "expand";
}

function importPresetShowModal() {
   document.body.style.overflow = "hidden";
   $("#importTextarea").val("");
   $('#importDiv').modal('show');
}

function hideImportModal() {
   $('#importDiv').modal('hide');
}

function checkImportTextarea() {
   let importedText = $("#importTextarea").val();
   if (importedText) {
      let tempDiv = $('<div>').append($(importedText).clone());
      if (tempDiv.find(".accordion").html()) {
         removeHelp();
         loadImportedAccordion(tempDiv);
         return !0;
      } else if (tempDiv.find(".accordionAlternate").html()) {
         removeHelp();
         loadImportedAccordionAlt(tempDiv);
         return !0;
      } else if (tempDiv.find(".cardAnimationDiv").html()) {
         removeHelp();
         loadImportedCard(tempDiv);
         return !0;
      } else if (tempDiv.find(".cardFlipMasterDiv").html()) {
         removeHelp();
         loadImportedFlashCardPreset(tempDiv);
         return !0;
      } else if (tempDiv.find(".checkBoxPageDiv").html()) {
         removeHelp();
         loadImportedChecklistPreset(tempDiv);
         return !0;
      } else if (tempDiv.find(".tabComponent").html()) {
         removeHelp();
         loadImportedTabsPreset(tempDiv);
         return !0;
      } else if (tempDiv.find(".fancyNumbers").html()) {
         removeHelp();
         loadImportedNumberListPreset(tempDiv);
         return !0;
      }
   }
   alert("Code does not match. Make sure you copied correctly");
}

function loadImportedAccordion(tempDiv) {
   $("#componentsDiv").empty();

   tempDiv.find(".accordion").each(function () {
      let accordionDivDiv = document.createElement("div");
      accordionDivDiv.className = "accordionDiv";
      // Draggable
      let accordionDraggableDiv = document.createElement("div");
      accordionDraggableDiv.className = "accordionDraggableDiv progress-bar-striped bg-success";

      // Accordion
      let accordionTitle = $(this).children().first()[0];
      accordionTitle.contentEditable = "true";
      accordionTitle.setAttribute("onclick", "accordionDoubletap(this)");

      let accordionContent = $(this).find(".accordionContent")[0];
      accordionContent.className = "accordionContent";
      accordionContent.contentEditable = "true";

      accordionDivDiv.appendChild(accordionDraggableDiv);
      accordionDivDiv.appendChild(this);

      $("#componentsDiv").append(accordionDivDiv);
   });

   isAccordion = 0;
   $("#page2TopBarDivTitle > p").text("Accordion");
   makeSortable();
   hideImportModal();
   animatePage1Out(!1);
}

function loadImportedAccordionAlt(tempDiv) {
   $("#componentsDiv").empty();

   tempDiv.find(".accordionAlternate").each(function () {
      let accordionDivDiv = document.createElement("div");
      accordionDivDiv.className = "accordionDiv";
      // Draggable
      let accordionDraggableDiv = document.createElement("div");
      accordionDraggableDiv.className = "accordionDraggableDiv progress-bar-striped bg-success";

      // Accordion
      let accordionTitle = $(this).children().first()[0];
      accordionTitle.contentEditable = "true";
      accordionTitle.setAttribute("onclick", "accordionAltDoubletap(this)");

      let accordionContent = $(this).find(".accordionAlternateContent")[0];
      accordionContent.className = "accordionAlternateContent";
      accordionContent.contentEditable = "true";

      accordionDivDiv.appendChild(accordionDraggableDiv);
      accordionDivDiv.appendChild(this);

      $("#componentsDiv").append(accordionDivDiv);
   });

   isAccordion = 1;
   $("#page2TopBarDivTitle > p").text("Accordion Alternate");
   makeSortable();
   hideImportModal();
   animatePage1Out(!1);
}

function loadImportedCard(tempDiv) {
   $("#componentsDiv").empty();

   tempDiv.find(".cardSwipeDiv").each(function () {
      this.removeAttribute("onmousedown");
      this.removeAttribute("onmouseup");
      this.removeAttribute("ontouchstart");
      this.removeAttribute("ontouchend");
      this.setAttribute("onclick", "ifDblClicked(this)");

      this.children[0].contentEditable = "true";
   });

   $("#componentsDiv").append(tempDiv.find(".cardAnimationDiv").eq(0)[0].outerHTML);

   // Div to contain the buttons
   let cardIndicatorDiv = document.createElement("div");
   cardIndicatorDiv.id = "cardIndicatorDiv";
   // Adding buttons for navigation
   let backBtn = document.createElement("button");
   backBtn.className = "btn btn-info";
   backBtn.id = "cardBackButton";
   backBtn.setAttribute("onclick", "goLeft(document.getElementsByClassName('cardSwipeDivDiv')[0])");
   backBtn.appendChild(document.createTextNode("View Previous Slide"));
   let forwardBtn = document.createElement("button");
   forwardBtn.className = "btn btn-info";
   forwardBtn.id = "cardNextButton";
   forwardBtn.setAttribute("onclick", "ifDblClicked2()");
   forwardBtn.appendChild(document.createTextNode("View Next Slide"));

   let totalCardChild = $(".cardAnimationDiv").children().length;
   let cardIndexIndicator = document.createElement("p");
   cardIndexIndicator.id = "cardIndexIndicator";
   cardIndexIndicator.className = "text-success";

   cardIndicatorDiv.appendChild(backBtn);
   cardIndicatorDiv.appendChild(cardIndexIndicator);
   cardIndicatorDiv.appendChild(forwardBtn);
   $("#componentsDiv").append(cardIndicatorDiv);

   cardCurrentIndex = 0;
   isAccordion = 2;
   $("#page2TopBarDivTitle > p").text("Card");
   startupCard();
   setCardIndicator();
   hideImportModal();
   animatePage1Out(!1);
}

function loadImportedFlashCardPreset(tempDiv) {
   $("#componentsDiv").empty();

   tempDiv.find(".cardFlipDivDiv").each(function () {
      let cardFlipFront = $(this).find(".cardFlipFront")[0];
      let cardFlipBack = $(this).find(".cardFlipBack")[0];

      cardFlipFront.setAttribute("ondblclick", "this.style.display='none'");
      cardFlipFront.contentEditable = "true";
      cardFlipBack.setAttribute("ondblclick", "this.previousElementSibling.style.display='flex'");
      cardFlipBack.contentEditable = "true";
   });

   $("#componentsDiv").html(tempDiv.find(".cardFlipMasterDiv").eq(0)[0].outerHTML);
   isAccordion = 4;
   $("#page2TopBarDivTitle > p").text("Card");
   hideImportModal();
   animatePage1Out(!1);
}

function loadImportedChecklistPreset(tempDiv) {
   $("#componentsDiv").empty();

   tempDiv.find(".checkBoxPageDiv").eq(0).children().first()[0].contentEditable = "true";
   tempDiv.find(".checkboxContainerCheckmark").each(function () {
      this.removeAttribute("for");
      this.contentEditable = "true";
   });

   $("#componentsDiv").html(tempDiv.find(".checkBoxPageDiv").eq(0)[0].outerHTML);
   isAccordion = 5;
   $("#page2TopBarDivTitle > p").text("Checklist");
   hideImportModal();
   animatePage1Out(!1);
}

function loadImportedTabsPreset(tempDiv) {
   $("#componentsDiv").empty();

   tempDiv.find(".tabComponentLinks:not(.tabComponentLinksClear)").each(function () {
      let tabComponentLinks = this;
      tabComponentLinks.className = "tabComponentLinks";
      tabComponentLinks.removeAttribute("onclick");
      tabComponentLinks.contentEditable = "true";
      tabComponentLinks.setAttribute("onclick", "tabsDoubletap(this)");
   });
   tempDiv.find(".tabComponentContent").each(function () {
      let tabComponentContent = this;
      tabComponentContent.className = "tabComponentContent";
      tabComponentContent.contentEditable = "true";
   });

   tempDiv.find(".tabComponentLinks").eq(0)[0].className = "tabComponentLinks tabComponentActive";
   tempDiv.find(".tabComponentContent").eq(0)[0].className = "tabComponentContent tabActiveContent";
   let tabComponent = tempDiv.find(".tabComponent").eq(0)[0].outerHTML;
   let tabComponentContentDiv = tempDiv.find(".tabComponentContentDiv").eq(0)[0].outerHTML;
   $("#componentsDiv").html(tabComponent + tabComponentContentDiv);
   isAccordion = 6;
   $("#page2TopBarDivTitle > p").text("Tabs");
   hideImportModal();
   animatePage1Out(!1);
}

function loadImportedNumberListPreset(tempDiv) {
   $("#componentsDiv").empty();

   tempDiv.find(".fancyNumbers").each(function () {
      let fancyNumbers = $(this);
      let fancyNumbersCircle = fancyNumbers.find(".fancyNumbersCircle").eq(0);
      fancyNumbersCircle[0].contentEditable = "true";
      fancyNumbers.find(".fancyNumbersCircle ~ *")[0].contentEditable = "true";
      let fancyNumbersColorInput = document.createElement("input");
      fancyNumbersColorInput.type = "color";
      fancyNumbersColorInput.className = "form-control";
      fancyNumbersColorInput.setAttribute("onchange", "this.nextElementSibling.style.backgroundColor = this.value;$('#changeColourHelp').html()&&($('#changeColourHelp').remove(),setTimeout(function(){addTooltip('To remove the checkbox, click on the it','removeListSelectHelp','page2BottomRightDiv',!1);tooltipShowPositionCheck()},600));");
      fancyNumbers.prepend(fancyNumbersColorInput);

      $("#componentsDiv").append(fancyNumbers);
      fancyNumbersColorInput.value = rgb2hex(fancyNumbersCircle.css("background-color"));
   });

   isAccordion = 7;
   $("#page2TopBarDivTitle > p").text("Tabs");
   hideImportModal();
   animatePage1Out(!1);
}

function tooltipShowPositionCheck() {
   if(document.getElementById("page2BottomLeftDivLeftDiv").className === "expand") {
      tooltipCheck(!1);
   }
}

function tooltipCheck(notExpanding) {
   if($(window).width() < 768) {
      if(notExpanding) {
         if ($("#selectTemplateHelp").html() || $("#selectTemplateRightHelp").html()) {
            $("#selectTemplateHelp").fadeOut();
            $("#selectTemplateRightHelp").fadeOut();
         }
         // Add and remove section add expand
         if ($("#addNewSectionHelp").html()) {
            $("#addNewSectionHelp")[0].className = "tooltips";
         }
         if ($("#removeHelp").html()) {
            $("#removeHelp")[0].className = "tooltips";
         }
         if ($("#completedHelp").html()) {
            $("#completedHelp")[0].className = "tooltips";
         }
         for(i=0;i<elementsToLoop.length;i++) {
            let elementId = "#" + elementsToLoop[i];
            if ($(elementId).html()) {
               $(elementId).css("top", "");
            }
         }
      } else {
         if ($("#selectTemplateHelp").html() || $("#selectTemplateRightHelp").html()) {
            $("#selectTemplateHelp").fadeIn();
            $("#selectTemplateRightHelp").fadeIn();
         }
         // Add and remove section add expand
         if ($("#addNewSectionHelp").html()) {
            $("#addNewSectionHelp")[0].className = "tooltips expand";
         }
         if ($("#removeHelp").html()) {
            $("#removeHelp")[0].className = "tooltips expand";
         }
         if ($("#completedHelp").html()) {
            $("#completedHelp")[0].className = "tooltips expand";
         }
         for(i=0;i<elementsToLoop.length;i++) {
            let elementId = "#" + elementsToLoop[i];
            if ($(elementId).html()) {
               let leftStr = $(elementId).css("top");
               leftStr = parseInt(leftStr.substring(0,leftStr.length-2)) + 250;
               $(elementId).css("top", leftStr+"px");
            }
         }
      }
   }else {
      if(notExpanding) {
         if ($("#selectTemplateHelp").html() || $("#selectTemplateRightHelp").html()) {
            $("#selectTemplateHelp").fadeOut();
            $("#selectTemplateRightHelp").fadeOut();
         }
         // Add and remove section add expand
         if ($("#addNewSectionHelp").html()) {
            $("#addNewSectionHelp")[0].className = "tooltips";
         }
         if ($("#removeHelp").html()) {
            $("#removeHelp")[0].className = "tooltips";
         }
         if ($("#completedHelp").html()) {
            $("#completedHelp")[0].className = "tooltips";
         }
         for(i=0;i<elementsToLoop.length;i++) {
            let elementId = "#" + elementsToLoop[i];
            if ($(elementId).html()) {
               $(elementId).css("left", "");
            }
         }
      } else {
         if ($("#selectTemplateHelp").html() || $("#selectTemplateRightHelp").html()) {
            $("#selectTemplateHelp").fadeIn();
            $("#selectTemplateRightHelp").fadeIn();
         }
         // Add and remove section add expand
         if ($("#addNewSectionHelp").html()) {
            $("#addNewSectionHelp")[0].className = "tooltips expand";
         }
         if ($("#removeHelp").html()) {
            $("#removeHelp")[0].className = "tooltips expand";
         }
         if ($("#completedHelp").html()) {
            $("#completedHelp")[0].className = "tooltips expand";
         }
         for(i=0;i<elementsToLoop.length;i++) {
            if("doubleClickTabHelp" === elementsToLoop[i]) {
               continue;
            }
            let elementId = "#" + elementsToLoop[i];
            if ($(elementId).html()) {
               let leftStr = $(elementId).css("left");
               leftStr = parseInt(leftStr.substring(0,leftStr.length-2)) + 200;
               $(elementId).css("left", leftStr+"px");
            }
         }
      }
   }
}

function showTemplates() {
   if(!isAnimating) {
      let page2BottomLeftDivLeftDiv = document.getElementById("page2BottomLeftDivLeftDiv");
      if ($(page2BottomLeftDivLeftDiv).hasClass("expand")) {
         if (document.getElementById("templateMainDiv").style.display === "none") {
            document.getElementById("hiddenCodeTextarea").style.display = "none";
            document.getElementById("templateMainDiv").style.display = "flex";
         } else {
            page2BottomLeftDivLeftDiv.className = "";
            tooltipCheck(!0);
            rotateDIV(document.getElementById("templateSelectionButton").children[0]);
         }
      } else {
         document.getElementById("hiddenCodeTextarea").style.display = "none";
         document.getElementById("templateMainDiv").style.display = "flex";
         page2BottomLeftDivLeftDiv.className = "expand";
         tooltipCheck(!1);
         rotateDIV(document.getElementById("templateSelectionButton").children[0]);
      }
   }
}

function showRightTemplate(labelDiv, index) {
   if (labelDiv.className !== "templateSelectionLabelDiv active") {
      // Remove tooltip if any and display next
      let gotHelp = !1;
      if (void 0 != $("#selectTemplateHelp").html()) {
         $("#selectTemplateHelp").remove();
         gotHelp = !0;
      }

      $("#templateMainDivLeft").children().each(function () {
         this.className = "templateSelectionLabelDiv";
      });
      labelDiv.className = "templateSelectionLabelDiv active";
      let photoArray = [];
      let obj;
      let obj2;
      switch (index) {
      case 0:
         obj = {
            src: "images/InteractiveComponent/Accordion.png",
            alt: "Accordion Template",
            onclick: "loadAccordionPreset()",
            text: "Accordion"
         };
         obj2 = {
            src: "images/InteractiveComponent/AccordionAlt.png",
            alt: "Accordion Alternate Template",
            onclick: "loadAccordionAltPreset()",
            text: "Accordion (Alt)"
         };
         photoArray.push(obj);
         photoArray.push(obj2);
         break;
      case 1:
         obj = {
            src: "images/InteractiveComponent/Card.png",
            alt: "Card Template",
            onclick: "loadCardPreset()",
            text: "Card"
         };
         obj2 = {
            src: "images/InteractiveComponent/FlashCard.png",
            alt: "Flashcard Template",
            onclick: "loadFlashCardPreset()",
            text: "Flash Card"
         };
         photoArray.push(obj);
         photoArray.push(obj2);
         break;
      case 2:
         obj = {
            src: "images/InteractiveComponent/Checklist.png",
            alt: "Checklist Template",
            onclick: "loadChecklistPreset()",
            text: "Checklist"
         };
         photoArray.push(obj);
         break;
      case 3:
         obj = {
            src: "images/InteractiveComponent/Tabs.png",
            alt: "Tabs Template",
            onclick: "loadTabsPreset()",
            text: "Tabs"
         };
         photoArray.push(obj);
         break;
      case 4:
         obj = {
            src: "images/InteractiveComponent/NumberList.png",
            alt: "Lists Template",
            onclick: "loadNumberListPreset()",
            text: "Lists"
         };
         photoArray.push(obj);
         break;
      default:
         break;
      }

      if (document.getElementById("templateMainDivRight").className === "expand") {
         document.getElementById("templateMainDivRight").className = "";
         setTimeout(function () {
            $("#templateMainDivRight").empty();
            for (i = 0; i < photoArray.length; i++) {
               let templateDivs = document.createElement("div");
               templateDivs.className = "templateDivs";
               let templateDivsImg = document.createElement("img");
               templateDivsImg.src = photoArray[i].src;
               templateDivsImg.alt = photoArray[i].alt;
               templateDivsImg.setAttribute("onclick", photoArray[i].onclick);
               let templateDivsP = document.createElement("p");
               templateDivsP.setAttribute("onclick", photoArray[i].onclick);
               templateDivsP.appendChild(document.createTextNode(photoArray[i].text));

               templateDivs.appendChild(templateDivsImg);
               templateDivs.appendChild(templateDivsP);
               $("#templateMainDivRight").append(templateDivs);
            }
            document.getElementById("templateMainDivRight").className = "expand";
         }, 500);
      } else {
         $("#templateMainDivRight").empty();
         for (i = 0; i < photoArray.length; i++) {
            let templateDivs = document.createElement("div");
            templateDivs.className = "templateDivs";
            let templateDivsImg = document.createElement("img");
            templateDivsImg.src = photoArray[i].src;
            templateDivsImg.alt = photoArray[i].alt;
            templateDivsImg.setAttribute("onclick", photoArray[i].onclick);
            let templateDivsP = document.createElement("p");
            templateDivsP.setAttribute("onclick", photoArray[i].onclick);
            templateDivsP.appendChild(document.createTextNode(photoArray[i].text));

            templateDivs.appendChild(templateDivsImg);
            templateDivs.appendChild(templateDivsP);
            $("#templateMainDivRight").append(templateDivs);
         }
         document.getElementById("templateMainDivRight").className = "expand";
      }

      if (gotHelp) {
         setTimeout(function () {
            addTooltip("Click on the components", "selectTemplateRightHelp", "templateMainDiv", !1);
         }, 600);
      }
   }
}

// Components Presets
function loadAccordionPreset() {
   // Close Help tooltip if any
   if (void 0 != $("#selectTemplateRightHelp").html()) {
      $("#selectTemplateRightHelp").remove();
      setTimeout(function () {
         addTooltip("Add a new accordion", "addNewSectionHelp", "page2BottomLeftDiv", !1);
         tooltipShowPositionCheck();
      }, 1100);
   }
   if (void 0 != $("#addNewSectionHelp").html()) {
      $("#addNewSectionHelp").remove();
      setTimeout(function () {
         addTooltip("Add a new accordion", "addNewSectionHelp", "page2BottomLeftDiv", !1);
         tooltipShowPositionCheck();
      }, 1100);
   }
   showTemplates();
   isAccordion = 0;
   $("#page2TopBarDivTitle > p").text("Accordion");
   let componentsDiv = document.getElementById("componentsDiv");
   $(componentsDiv).empty();
   // Making first opened
   let accordionDiv = addNewAccordion("London", "London is the capital city of England.");
   $(accordionDiv).find(".accordion")[0].className = "accordion expand";
   let accordionDiv2 = addNewAccordion("Paris", "Paris is the capital of France.");
   let accordionDiv3 = addNewAccordion("Tokyo", "Tokyo is the capital of Japan.");
   componentsDiv.appendChild(accordionDiv);
   componentsDiv.appendChild(accordionDiv2);
   componentsDiv.appendChild(accordionDiv3);
   makeSortable();
}

function loadAccordionAltPreset() {
   // Close Help tooltip if any
   if (void 0 != $("#selectTemplateRightHelp").html()) {
      $("#selectTemplateRightHelp").remove();
      setTimeout(function () {
         addTooltip("Add a new accordion", "addNewSectionHelp", "page2BottomLeftDiv", !1);
         tooltipShowPositionCheck();
      }, 1100);
   }
   if (void 0 != $("#addNewSectionHelp").html()) {
      $("#addNewSectionHelp").remove();
      setTimeout(function () {
         addTooltip("Add a new accordion", "addNewSectionHelp", "page2BottomLeftDiv", !1);
         tooltipShowPositionCheck();
      }, 1100);
   }
   showTemplates();
   isAccordion = 1;
   $("#page2TopBarDivTitle > p").text("Accordion Alternate");
   let componentsDiv = document.getElementById("componentsDiv");
   $(componentsDiv).empty();
   // Making first opened
   let accordionDiv = addNewAltAccordion("London", "London is the capital city of England.");
   $(accordionDiv).find(".accordionAlternate")[0].className = "accordionAlternate expand";
   let accordionDiv2 = addNewAltAccordion("Paris", "Paris is the capital of France.");
   let accordionDiv3 = addNewAltAccordion("Tokyo", "Tokyo is the capital of Japan.");
   componentsDiv.appendChild(accordionDiv);
   componentsDiv.appendChild(accordionDiv2);
   componentsDiv.appendChild(accordionDiv3);
   makeSortable();
}

function loadCardPreset() {
   // Close Help tooltip if any
   if (void 0 != $("#selectTemplateRightHelp").html()) {
      $("#selectTemplateRightHelp").remove();
      setTimeout(function () {
         addTooltip("Add a new card", "addNewSectionHelp", "page2BottomLeftDiv", !1);
         tooltipShowPositionCheck();
      }, 1100);
   }
   if (void 0 != $("#addNewSectionHelp").html()) {
      $("#addNewSectionHelp").remove();
      setTimeout(function () {
         addTooltip("Add a new card", "addNewSectionHelp", "page2BottomLeftDiv", !1);
         tooltipShowPositionCheck();
      }, 1100);
   }
   showTemplates();
   isAccordion = 2;
   cardCurrentIndex = 0;

   $("#page2TopBarDivTitle > p").text("Card");
   // Adding the card
   let cardAnimationDiv = document.createElement("div");
   cardAnimationDiv.className = "cardAnimationDiv";
   // CardSwipeDivDiv is for Alt but left in for original also
   let cardSwipeDivDiv = document.createElement("div");
   cardSwipeDivDiv.className = "cardSwipeDivDiv";
   cardSwipeDivDiv.appendChild(addNewCard("London", "London is the capital city of England."));
   cardSwipeDivDiv.appendChild(addNewCard("Paris", "Paris is the capital of France."));
   cardSwipeDivDiv.appendChild(addNewCard("Tokyo", "Tokyo is the capital of Japan."));
   let componentsDiv = document.getElementById("componentsDiv");
   $(componentsDiv).empty();
   cardAnimationDiv.appendChild(cardSwipeDivDiv);
   componentsDiv.appendChild(cardAnimationDiv);
   // Code that also be needed to be added at output
   // for(let oriPos,z=0;z!=document.getElementsByClassName("cardAnimationDiv").length;){for(let nodeArray=document.getElementsByClassName("cardAnimationDiv")[z].children,i=0,j=nodeArray.length-1;i!=nodeArray.length;)nodeArray[i].style.zIndex=j,1!=i&&0!=i&&(nodeArray[i].style.display="none"),i++,j--;z++};

   // Div to contain the buttons
   let cardIndicatorDiv = document.createElement("div");
   cardIndicatorDiv.id = "cardIndicatorDiv";
   // Adding buttons for navigation
   let backBtn = document.createElement("button");
   backBtn.className = "btn btn-info";
   backBtn.id = "cardBackButton";
   backBtn.setAttribute("onclick", "goLeft(document.getElementsByClassName('cardSwipeDivDiv')[0])");
   backBtn.appendChild(document.createTextNode("View Previous Slide"));
   let forwardBtn = document.createElement("button");
   forwardBtn.className = "btn btn-info";
   forwardBtn.id = "cardNextButton";
   forwardBtn.setAttribute("onclick", "ifDblClicked2()");
   forwardBtn.appendChild(document.createTextNode("View Next Slide"));

   let totalCardChild = $(".cardAnimationDiv").children().length;
   let cardIndexIndicator = document.createElement("p");
   cardIndexIndicator.id = "cardIndexIndicator";
   cardIndexIndicator.className = "text-success";

   cardIndicatorDiv.appendChild(backBtn);
   cardIndicatorDiv.appendChild(cardIndexIndicator);
   cardIndicatorDiv.appendChild(forwardBtn);
   componentsDiv.appendChild(cardIndicatorDiv);

   startupCard();
   setCardIndicator();
}

function loadFlashCardPreset() {
   // Close Help tooltip if any
   if (void 0 != $("#selectTemplateRightHelp").html()) {
      $("#selectTemplateRightHelp").remove();
      setTimeout(function () {
         addTooltip("Add a new Flash Card", "addNewSectionHelp", "page2BottomLeftDiv", !1);
         tooltipShowPositionCheck();
      }, 1100);
   }
   if (void 0 != $("#addNewSectionHelp").html()) {
      $("#addNewSectionHelp").remove();
      setTimeout(function () {
         addTooltip("Add a new Flash Card", "addNewSectionHelp", "page2BottomLeftDiv", !1);
         tooltipShowPositionCheck();
      }, 1100);
   }
   showTemplates();
   isAccordion = 4;
   $("#page2TopBarDivTitle > p").text("Flash Card");
   let componentsDiv = document.getElementById("componentsDiv");
   let cardFlipMasterDiv = document.createElement("div");
   cardFlipMasterDiv.className = "cardFlipMasterDiv";
   $(componentsDiv).empty();
   cardFlipMasterDiv.appendChild(addNewFlashCard("London", "London is the capital city of England."));
   cardFlipMasterDiv.appendChild(addNewFlashCard("Paris", "Paris is the capital of France."));
   cardFlipMasterDiv.appendChild(addNewFlashCard("Tokyo", "Tokyo is the capital of Japan."));
   componentsDiv.appendChild(cardFlipMasterDiv);
}

function loadChecklistPreset() {
   // Close Help tooltip if any
   if (void 0 != $("#selectTemplateRightHelp").html()) {
      $("#selectTemplateRightHelp").remove();
      setTimeout(function () {
         addTooltip("Add a new checkbox", "addNewSectionHelp", "page2BottomLeftDiv", !1);
         tooltipShowPositionCheck();
      }, 1100);
   }
   if (void 0 != $("#addNewSectionHelp").html()) {
      $("#addNewSectionHelp").remove();
      setTimeout(function () {
         addTooltip("Add a new checkbox", "addNewSectionHelp", "page2BottomLeftDiv", !1);
         tooltipShowPositionCheck();
      }, 1100);
   }
   showTemplates();
   isAccordion = 5;
   $("#page2TopBarDivTitle > p").text("Checklist");
   let componentsDiv = document.getElementById("componentsDiv");
   let checkBoxPageDiv = document.createElement("div");
   checkBoxPageDiv.className = "checkBoxPageDiv";
   let checkBoxPageDivP = document.createElement("p");
   checkBoxPageDivP.appendChild(document.createTextNode("Capital Cities"));
   checkBoxPageDivP.contentEditable = "true";
   checkBoxPageDiv.appendChild(checkBoxPageDivP);
   $(componentsDiv).empty();
   checkBoxPageDiv.appendChild(addNewChecklist("London"));
   checkBoxPageDiv.appendChild(addNewChecklist("Paris"));
   checkBoxPageDiv.appendChild(addNewChecklist("Tokyo"));
   componentsDiv.appendChild(checkBoxPageDiv);
}

function loadTabsPreset() {
   // Close Help tooltip if any
   if (void 0 != $("#selectTemplateRightHelp").html()) {
      $("#selectTemplateRightHelp").remove();
      setTimeout(function () {
         addTooltip("Add a new Tab", "addNewSectionHelp", "page2BottomLeftDiv", !1);
         tooltipShowPositionCheck();
      }, 1100);
   }
   if (void 0 != $("#addNewSectionHelp").html()) {
      $("#addNewSectionHelp").remove();
      setTimeout(function () {
         addTooltip("Add a new Tab", "addNewSectionHelp", "page2BottomLeftDiv", !1);
         tooltipShowPositionCheck();
      }, 1100);
   }
   showTemplates();
   isAccordion = 6;
   $("#page2TopBarDivTitle > p").text("Tabs");
   let componentsDiv = document.getElementById("componentsDiv");
   let tabComponent = document.createElement("div");
   tabComponent.className = "tabComponent";
   let tabComponentLinks = document.createElement("div");
   tabComponentLinks.className = "tabComponentLinks tabComponentActive";
   tabComponentLinks.setAttribute("onclick", "tabsDoubletap(this)");
   tabComponentLinks.contentEditable = "true";
   let tabComponentLinksP = document.createElement("p");
   tabComponentLinksP.appendChild(document.createTextNode("London"));
   let tabComponentContentDiv = document.createElement("div");
   tabComponentContentDiv.className = "tabComponentContentDiv";
   let tabComponentContent = document.createElement("div");
   tabComponentContent.className = "tabComponentContent tabActiveContent";
   tabComponentContent.contentEditable = "true";
   let tabComponentContentP = document.createElement("p");
   tabComponentContentP.appendChild(document.createTextNode("London is the capital city of England."));

   tabComponentLinks.appendChild(tabComponentLinksP);
   let tab2 = addNewTabs("Paris", "Paris is the capital of France.");
   let tab3 = addNewTabs("Tokyo", "Tokyo is the capital of Japan.");
   tabComponent.appendChild(tabComponentLinks);
   tabComponent.appendChild(tab2.tabComponentLinksTab);
   tabComponent.appendChild(tab3.tabComponentLinksTab);
   tabComponentContent.appendChild(tabComponentContentP);
   tabComponentContentDiv.appendChild(tabComponentContent);
   tabComponentContentDiv.appendChild(tab2.tabComponentContentTab);
   tabComponentContentDiv.appendChild(tab3.tabComponentContentTab);
   $(componentsDiv).empty();
   componentsDiv.appendChild(tabComponent);
   componentsDiv.appendChild(tabComponentContentDiv);
   contentEditableBr();
}

function loadNumberListPreset() {
   // Close Help tooltip if any
   if (void 0 != $("#selectTemplateRightHelp").html()) {
      $("#selectTemplateRightHelp").remove();
      setTimeout(function () {
         addTooltip("Add a new list", "addNewSectionHelp", "page2BottomLeftDiv", !1);
         tooltipShowPositionCheck();
      }, 1100);
   }
   if (void 0 != $("#addNewSectionHelp").html()) {
      $("#addNewSectionHelp").remove();
      setTimeout(function () {
         addTooltip("Add a new list", "addNewSectionHelp", "page2BottomLeftDiv", !1);
         tooltipShowPositionCheck();
      }, 1100);
   }
   showTemplates();
   isAccordion = 7;
   $("#page2TopBarDivTitle > p").text("Lists");
   let componentsDiv = document.getElementById("componentsDiv");
   $(componentsDiv).empty();
   componentsDiv.appendChild(addNewNumberList("London"));
   componentsDiv.appendChild(addNewNumberList("Paris"));
   componentsDiv.appendChild(addNewNumberList("Tokyo"));
   getNumberListIndex();
}

// Adding and Removing
// 3 was intended to be Card (Alt), he's dead...
function addNewSection() {
   switch (isAccordion) {
   case 0:
      // Remove help
      if ($("#addNewSectionHelp").html()) {
         $("#addNewSectionHelp").remove();
         setTimeout(function () {
            addTooltip("Double click on an accordion to open/close it", "doubleClickAccordionHelp", "page2BottomRightDiv", !1);
            tooltipShowPositionCheck();
         }, 500);
      }
      document.getElementById("componentsDiv").appendChild(addNewAccordion(null));
      makeSortable();
      break;
   case 1:
      // Remove help
      if ($("#addNewSectionHelp").html()) {
         $("#addNewSectionHelp").remove();
         setTimeout(function () {
            addTooltip("Double click on an accordion to open/close it", "doubleClickAccordionHelp", "page2BottomRightDiv", !1);
            tooltipShowPositionCheck();
         }, 500);
      }
      document.getElementById("componentsDiv").appendChild(addNewAltAccordion(null));
      makeSortable();
      break;
   case 2:
      // Remove help
      if ($("#addNewSectionHelp").html()) {
         $("#addNewSectionHelp").remove();
         setTimeout(function () {
            addTooltip("Click on 'View Next Slide' to view next card", "viewNextHelp", "componentsDiv", !1);
            tooltipShowPositionCheck();
         }, 500);
      }
      let newCard = addNewCard(null);
      document.getElementsByClassName("cardSwipeDivDiv")[0].appendChild(newCard);
      startupCard();
      setCardIndicator();
      break;
   case 4:
      // Remove help
      if ($("#addNewSectionHelp").html()) {
         $("#addNewSectionHelp").remove();
         setTimeout(function () {
            addTooltip("This is front of the card, double click to view/edit the back", "doubleClickFlashCardHelp", "componentsDiv", !1);
            tooltipShowPositionCheck();
         }, 500);
      }
      document.getElementsByClassName("cardFlipMasterDiv")[0].appendChild(addNewFlashCard(null, null));
      break;
   case 5:
      // Remove help
      if ($("#addNewSectionHelp").html()) {
         $("#addNewSectionHelp").remove();
         setTimeout(function () {
            addTooltip("To remove a checkbox click on one", "removeCheckboxSelectHelp", "page2BottomRightDiv", !1);
            tooltipShowPositionCheck();
         }, 500);
      }
      $(".checkBoxPageDiv").append(addNewChecklist(null));
      break;
   case 6:
      // Remove help
      if ($("#addNewSectionHelp").html()) {
         $("#addNewSectionHelp").remove();
         setTimeout(function () {
            addTooltip("Double click to view the tab", "doubleClickTabHelp", "page2BottomRightDiv", !1);
            tooltipShowPositionCheck();
         }, 500);
      }
      let newTab = addNewTabs(null, null);
      $(".tabComponent").append(newTab.tabComponentLinksTab);
      $(".tabComponentContentDiv").append(newTab.tabComponentContentTab);
      $(".tabComponentLinksClear").remove();
      break;
   case 7:
      // Remove help
      if ($("#addNewSectionHelp").html()) {
         $("#addNewSectionHelp").remove();
         setTimeout(function () {
            addTooltip("To change colour, click on this", "changeColourHelp", "page2BottomRightDiv", !1);
            tooltipShowPositionCheck();
         }, 500);
      }
      $("#componentsDiv").append(addNewNumberList(null));
      break;
   default:
      break;
   }
   setHiddenHTML();
}

function removeSection() {
   if (isAccordion >= 0 && $("#removeHelp").html()) {
      $("#removeHelp").remove();
      setTimeout(function () {
         addTooltip("When you are done, click on save to generate the HTML", "completedHelp", "page2BottomRightDiv", !0);
         tooltipShowPositionCheck()
      }, 500);
   }
   switch (isAccordion) {
   case 0:
   case 1:
      if (selectedAccordionForDeletion) {
         $(selectedAccordionForDeletion).remove();
      }
      break;
   case 2:
   case 3:
      let cardSwipeDivDivChildren = $(".cardSwipeDiv");
      if(cardSwipeDivDivChildren.length > 1) {
         for (i = 0; i < cardSwipeDivDivChildren.length; i++) {
            // Not first
            if (cardSwipeDivDivChildren.eq(i).css("display") === "flex" && i >= 1) {
               document.getElementById("cardBackButton").disabled = true;
               document.getElementById("cardNextButton").disabled = true;
               goLeft(document.getElementsByClassName("cardSwipeDivDiv")[0]);
               $(".cardSwipeDiv").eq(cardCurrentIndex)[0].style.left = 0;
               setTimeout(function () {
                  $(".cardSwipeDiv").eq(cardCurrentIndex + 1).remove();
                  startupCard();
                  // Enable the Prev Slide Button
                  document.getElementById("cardBackButton").disabled = false;
                  document.getElementById("cardNextButton").disabled = false;
                  setCardIndicator();
               }, 510);
               break;
            } else if (cardSwipeDivDivChildren.eq(i).css("display") === "flex" && i === 0) {
               document.getElementById("cardBackButton").disabled = true;
               document.getElementById("cardNextButton").disabled = true;
               ifDblClicked(document.getElementsByClassName("cardSwipeDivDiv")[0]);
               setTimeout(function () {
                  $(".cardSwipeDiv").eq(cardCurrentIndex).remove();
                  // Enable the Prev Slide Button
                  document.getElementById("cardBackButton").disabled = false;
                  document.getElementById("cardNextButton").disabled = false;
                  setCardIndicator();
               }, 500);
               break;
            }
         }
      }
      break;
   case 4:
      if (selectedFlashCardForDeletion) {
         $(selectedFlashCardForDeletion).remove();
      }
      break;
   case 5:
      if (selectedChecklistForDeletion) {
         $(selectedChecklistForDeletion).remove();
      }
      break;
   case 6:
      if (!isNaN(selectedTabForDeletion) && $(".tabComponentLinks:not(.tabComponentLinksClear)").length > 1) {
         let tabComponent = $(".tabComponent");
         let tabComponentContentDiv = $(".tabComponentContentDiv");
         try {
            tabComponent.find(".tabComponentLinks").eq(selectedTabForDeletion).remove();
            tabComponentContentDiv.find(".tabComponentContent").eq(selectedTabForDeletion).remove();
         } catch (e) {
            console.log(e.message);
         }

         // Open previous or next tab is no active
         let gotActive = !1;
         tabComponent.find(".tabComponentLinks").each(function () {
            if (this.className === "tabComponentLinks tabComponentActive") {
               gotActive = !0;
            }
         });
         tabComponentContentDiv.find(".tabComponentContent").each(function () {
            if (this.className === "tabComponentContent tabActiveContent") {
               gotActive = !0;
            }
         });
         if ($(".tabComponentLinks:not(.tabComponentLinksClear)").length >= 1) {
            if (selectedTabForDeletion > 0) {
               selectedTabForDeletion--;
            }
         }
         if (!gotActive) {
            tabComponent.children().eq(selectedTabForDeletion)[0].className = "tabComponentLinks tabComponentActive";
            tabComponentContentDiv.children().eq(selectedTabForDeletion)[0].className = "tabComponentContent tabActiveContent";
         }

         if ($(".tabComponentLinks:not(.tabComponentLinksClear)").length <= 1) {
            // For clearing
            let tabComponentLinksClear = document.createElement("div");
            tabComponentLinksClear.className = "tabComponentLinks tabComponentLinksClear";
            tabComponent.appendChild(tabComponentLinksClear);
         }
      }
      break;
   case 7:
      if (selectedNumberListForDeletion) {
         $(selectedNumberListForDeletion).remove();
      }
      break;
   }
   setHiddenHTML();
}

// Adding Section
function addNewAccordion(labelText, labelText2) {
   if (!labelText || !labelText2) {
      labelText = "Accordion";
      labelText2 = "Accordion Content";
   }
   let accordionDivDiv = document.createElement("div");
   accordionDivDiv.className = "accordionDiv";
   // Draggable
   let accordionDraggableDiv = document.createElement("div");
   accordionDraggableDiv.className = "accordionDraggableDiv progress-bar-striped bg-success";
   // Accordion
   let accordionDiv = document.createElement("div");
   accordionDiv.className = "accordion";
   let accordionTitleDiv = document.createElement("div");
   // Double click for editing... remember to change on output
   accordionTitleDiv.setAttribute("onclick", "accordionDoubletap(this)");;
   accordionTitleDiv.contentEditable = "true";
   let accordionTitle = document.createElement("p");
   accordionTitle.appendChild(document.createTextNode(labelText));
   let accordionContent = document.createElement("div");
   // Contenteditable for editing... remember to change on output
   accordionContent.className = "accordionContent";
   accordionContent.contentEditable = "true";
   accordionContent.innerHTML = "<p>" + labelText2 + "</p>";

   contentEditableBr();

   accordionTitleDiv.appendChild(accordionTitle);
   accordionDiv.appendChild(accordionTitleDiv);
   accordionDiv.appendChild(accordionContent);

   accordionDivDiv.appendChild(accordionDraggableDiv);
   accordionDivDiv.appendChild(accordionDiv);

   return accordionDivDiv;
}

function addNewAltAccordion(labelText, labelText2) {
   if (!labelText || !labelText2) {
      labelText = "Accordion";
      labelText2 = "Accordion Content";
   }
   let accordionDivDiv = document.createElement("div");
   accordionDivDiv.className = "accordionDiv";
   // Draggable
   let accordionDraggableDiv = document.createElement("div");
   accordionDraggableDiv.className = "accordionDraggableDiv progress-bar-striped bg-success";
   // Accordion
   let accordionDiv = document.createElement("div");
   accordionDiv.className = "accordionAlternate";
   let accordionTitleDiv = document.createElement("div");
   // Double click for editing... remember to change on output
   accordionTitleDiv.setAttribute("onclick", "accordionAltDoubletap(this)");;
   accordionTitleDiv.contentEditable = "true";
   let accordionTitle = document.createElement("p");
   accordionTitle.appendChild(document.createTextNode(labelText));
   contentEditableBr();

   let accordionContent = document.createElement("div");
   // Contenteditable for editing... remember to change on output
   accordionContent.className = "accordionAlternateContent";
   accordionContent.contentEditable = "true";
   accordionContent.innerHTML = "<p>" + labelText2 + "</p>";

   contentEditableBr();

   accordionTitleDiv.appendChild(accordionTitle);
   accordionDiv.appendChild(accordionTitleDiv);
   accordionDiv.appendChild(accordionContent);

   accordionDivDiv.appendChild(accordionDraggableDiv);
   accordionDivDiv.appendChild(accordionDiv);

   return accordionDivDiv;
}

function addNewCard(labelText, labelText2) {
   if (!labelText || !labelText2) {
      labelText = "Card";
      labelText2 = "Card Content";
   }
   let cardSwipeDiv = document.createElement("div");
   cardSwipeDiv.className = "cardSwipeDiv";
   cardSwipeDiv.setAttribute("onclick", "ifDblClicked(this)");
   let cardAnimationDivTitle = document.createElement("p");
   cardAnimationDivTitle.contentEditable = "true";
   cardAnimationDivTitle.appendChild(document.createTextNode(labelText));
   let cardSwipeContent = document.createElement("div");
   cardSwipeContent.className = "cardSwipeContent";
   cardSwipeContent.contentEditable = "true";
   let cardSwipeContentP = document.createElement("p");
   cardSwipeContentP.appendChild(document.createTextNode(labelText2));

   cardSwipeContent.appendChild(cardSwipeContentP);
   cardSwipeDiv.appendChild(cardAnimationDivTitle);
   cardSwipeDiv.appendChild(cardSwipeContent);

   contentEditableBr();

   return cardSwipeDiv;
}

function setCardIndicator() {
   $("#cardIndexIndicator").html((cardCurrentIndex + 1) + " <span style='color:#6c757d'>-</span> <span style='color:#dc3545'>" + $(".cardSwipeDivDiv").children().length + "</span>");
}

function addNewFlashCard(labelText, labelText2) {
   if (!labelText || !labelText2) {
      labelText = "Flash Card Front";
      labelText2 = "Flash Card Back";
   }
   let cardFlipDiv = document.createElement("div");
   cardFlipDiv.className = "cardFlipDiv";
   let cardFlipDivDiv = document.createElement("div");
   cardFlipDivDiv.className = "cardFlipDivDiv";
   let cardFlipFront = document.createElement("div");
   cardFlipFront.className = "cardFlipFront";
   cardFlipFront.setAttribute("onclick", "var now=(new Date).getTime(),timesince=now-latestTap;400>timesince&&0<timesince?(this.style.display='none',$('#doubleClickFlashCardHelp').html()&&($('#doubleClickFlashCardHelp').remove(),setTimeout(function(){addTooltip('This blue side is the back of the card, click on the flash card for removal','removeSelectFlashCardHelp','componentsDiv',!1)},600)),latestTap=0):latestTap=(new Date).getTime();");
   cardFlipFront.contentEditable = "true";
   let cardFlipFrontP = document.createElement("p");
   cardFlipFrontP.appendChild(document.createTextNode(labelText));
   let cardFlipBack = document.createElement("div");
   cardFlipBack.className = "cardFlipBack";
   cardFlipBack.setAttribute("onclick", "var now=(new Date).getTime(),timesince=now-latestTap;400>timesince&&0<timesince?(this.previousElementSibling.style.display='flex',$('#doubleClickFlashCardHelp').html()&&($('#doubleClickFlashCardHelp').remove(),setTimeout(function(){addTooltip('To remove the flash card, click on it','removeSelectFlashCardHelp','componentsDiv',!1)},600)),latestTap=0):latestTap=(new Date).getTime();");
   let cardFlipBackP = document.createElement("p");
   cardFlipBackP.appendChild(document.createTextNode(labelText2));
   cardFlipBack.contentEditable = "true";

   cardFlipFront.appendChild(cardFlipFrontP);
   cardFlipBack.appendChild(cardFlipBackP);
   cardFlipDivDiv.appendChild(cardFlipFront);
   cardFlipDivDiv.appendChild(cardFlipBack);
   cardFlipDiv.appendChild(cardFlipDivDiv);

   contentEditableBr();
   return cardFlipDiv;
}

function addNewChecklist(labelText) {
   if (!labelText) {
      labelText = "Checklist";
   }
   let randomGenerated = getRandomWords();
   let checkboxContainer = document.createElement("div");
   checkboxContainer.className = "checkboxContainer";
   let checkboxContainerCheckbox = document.createElement("input");
   checkboxContainerCheckbox.setAttribute("onchange", "localStorage.setItem(this.id, this.checked)");
   checkboxContainerCheckbox.type = "checkbox";
   checkboxContainerCheckbox.id = randomGenerated;
   let checkboxContainerCheckboxLabel = document.createElement("label");
   checkboxContainerCheckboxLabel.className = "checkboxContainerCheckmark";
   checkboxContainerCheckboxLabel.appendChild(document.createTextNode(labelText));
   checkboxContainerCheckboxLabel.contentEditable = "true";

   checkboxContainer.appendChild(checkboxContainerCheckbox);
   checkboxContainer.appendChild(checkboxContainerCheckboxLabel);

   return checkboxContainer;
}

function addNewTabs(labelText, labelText2) {
   if (!labelText || !labelText2) {
      labelText = "Tab Title";
      labelText2 = "Tab Content";
   }
   let tabComponentLinks = document.createElement("div");
   tabComponentLinks.className = "tabComponentLinks";
   tabComponentLinks.setAttribute("onclick", "tabsDoubletap(this)");
   tabComponentLinks.contentEditable = "true";
   let tabComponentLinksP = document.createElement("p");
   tabComponentLinksP.appendChild(document.createTextNode(labelText));
   let tabComponentContent = document.createElement("div");
   tabComponentContent.className = "tabComponentContent";
   tabComponentContent.contentEditable = "true";
   let tabComponentContentP = document.createElement("p");
   tabComponentContentP.appendChild(document.createTextNode(labelText2));

   tabComponentLinks.appendChild(tabComponentLinksP);
   tabComponentContent.appendChild(tabComponentContentP);
   contentEditableBr();

   return {
      tabComponentLinksTab: tabComponentLinks,
      tabComponentContentTab: tabComponentContent
   }
}

function addNewNumberList(labelText) {
   if (!labelText) {
      labelText = "List";
   }
   getNumberListIndex();
   let fancyNumbers = document.createElement("div");
   fancyNumbers.className = "fancyNumbers";
   let fancyNumbersColorInput = document.createElement("input");
   fancyNumbersColorInput.type = "color";
   fancyNumbersColorInput.value = "#6600cc";
   fancyNumbersColorInput.className = "form-control";
   fancyNumbersColorInput.setAttribute("onchange", "this.nextElementSibling.style.backgroundColor = this.value;$('#changeColourHelp').html()&&($('#changeColourHelp').remove(),setTimeout(function(){addTooltip('To remove the checkbox, click on the it','removeListSelectHelp','page2BottomRightDiv',!1);tooltipShowPositionCheck()},600));");
   let fancyNumbersCircle = document.createElement("div");
   fancyNumbersCircle.className = "fancyNumbersCircle";
   fancyNumbersCircle.contentEditable = "true";
   let fancyNumbersCircleP = document.createElement("p");
   fancyNumbersCircleP.appendChild(document.createTextNode(numberListIndex));
   let fancyNumbersContent = document.createElement("div");
   fancyNumbersContent.contentEditable = "true";
   let fancyNumbersContentP = document.createElement("p");
   fancyNumbersContentP.appendChild(document.createTextNode(labelText));
   contentEditableBr();

   fancyNumbersCircle.appendChild(fancyNumbersCircleP);
   fancyNumbersContent.appendChild(fancyNumbersContentP);
   fancyNumbers.appendChild(fancyNumbersColorInput);
   fancyNumbers.appendChild(fancyNumbersCircle);
   fancyNumbers.appendChild(fancyNumbersContent);

   return fancyNumbers;
}

// Hidden HTML
function toggleHiddenCodes() {
   if (!isAnimating) {
      let page2BottomLeftDivLeftDiv = document.getElementById("page2BottomLeftDivLeftDiv");
      if ($(page2BottomLeftDivLeftDiv).hasClass("expand")) {
         if (document.getElementById("hiddenCodeTextarea").style.display === "none") {
            document.getElementById("templateMainDiv").style.display = "none";
            document.getElementById("hiddenCodeTextarea").style.display = "flex";
         } else {
            isAnimating = !0;
            page2BottomLeftDivLeftDiv.className = "";
            tooltipCheck(!0);
            rotateDIV(document.getElementById("templateSelectionButton").children[0]);
            setTimeout(function() {
               isAnimating = !0;
               $("#hiddenCodesButton > :first-child").effect("shake", {distance: 5, times: 5});
            }, 1000);
            setTimeout(function() {
               isAnimating = !1;
            }, 1500);
         }
      } else {
         isAnimating = !0;
         document.getElementById("templateMainDiv").style.display = "none";
         document.getElementById("hiddenCodeTextarea").style.display = "flex";
         page2BottomLeftDivLeftDiv.className = "expand";
         tooltipCheck(!1);
         rotateDIV(document.getElementById("templateSelectionButton").children[0]);
         setTimeout(function() {
            isAnimating = !0;
            $("#hiddenCodesButton > :first-child").effect("shake", {distance: 5, times: 5});
         }, 1000);
         setTimeout(function() {
            isAnimating = !1;
         }, 1500);
      }
      setHiddenHTML();
   }
}

function updateComponentsDiv() {
   let output = document.createElement("div");
   output.innerHTML = cm.getValue();
   let componentsDiv = $("#componentsDiv").clone().children();
   for (i = 0; i < componentsDiv.length; i++) {
      for (j = 0; j < excludeInHidden.length; j++) {
         if ("#" + componentsDiv[i].id === excludeInHidden[j]) {
            output.insertBefore(componentsDiv[i], output.childNodes[i]);
         }
      }
   }
   $("#componentsDiv").html(output.innerHTML);
   if (isAccordion === 2) {
      startupCard();
      setCardIndicator();
   }
   contentEditableBr();
}

function setHiddenHTML() {
   let componentsDiv = $("#componentsDiv").clone();
   for (i = 0; i < excludeInHidden.length; i++) {
      if (componentsDiv.find(excludeInHidden[i])) {
         componentsDiv.find(excludeInHidden[i]).remove();
      }
   }
   cm.setValue(html_beautify(componentsDiv.html(), {
      indent_size: 2
   }));
}

// Output page2
function page2Output() {
   if ($("#componentsDiv").html()) {
      removeHelp();
      $("#page2OutputTextarea").val("");
      $("#tempDiv").empty();
      let componentsDiv = $("#componentsDiv").clone();
      switch (isAccordion) {
      case 0: // Accordion
         componentsDiv.find(".accordion").each(function () {
            let accordion = $(this);
            let accordionTitle = accordion.children().eq(0)[0];
            let accordionContent = accordion.children().eq(1)[0];

            // Remove contentEditable
            accordion[0].className = "accordion";
            accordionTitle.removeAttribute("contenteditable");
            accordionContent.removeAttribute("contenteditable");

            // Changing dblclick to click
            accordionTitle.setAttribute("onclick", "this.parentElement.className='accordion'===this.parentElement.className?'accordion expand':'accordion';");
            $("#page2OutputTextarea")[0].value += accordion[0].outerHTML;
         });
         break;
      case 1: // Accordion Alternate
         componentsDiv.find(".accordionAlternate").each(function () {
            let accordion = $(this);
            let accordionTitle = accordion.children().eq(0)[0];
            let accordionContent = accordion.children().eq(1)[0];

            // Remove contentEditable
            accordion[0].className = "accordionAlternate";
            accordionTitle.removeAttribute("contenteditable");
            accordionContent.removeAttribute("contenteditable");

            // Changing dblclick to click
            accordionTitle.setAttribute("onclick", "this.parentElement.className='accordionAlternate'===this.parentElement.className?'accordionAlternate expand':'accordionAlternate';");
            $("#page2OutputTextarea")[0].value += accordion[0].outerHTML;
         });
         break;
      case 2: // Card
         componentsDiv.find(".cardAnimationDiv > .cardSwipeDivDiv > .cardSwipeDiv").each(function () {
            let card = $(this);
            let cardTitle = card.children().eq(0)[0];
            let cardContent = card.children().eq(1)[0];

            // Remove contentEditable
            cardTitle.removeAttribute("contenteditable");
            cardContent.removeAttribute("contenteditable");
            cardTitle.removeAttribute("class");
            cardContent.className = "cardSwipeContent";
            this.removeAttribute("style");
            this.removeAttribute("ondblclick");
            this.setAttribute("onmousedown",
               cardMouseDown
            );
            this.setAttribute("onmouseup",
               cardMouseUp
            );
            this.setAttribute("ontouchstart",
               cardMouseDown
            );
            this.setAttribute("ontouchend",
               cardMouseUp
            );
            this.setAttribute("onclick",
               cardDblClick
            );
         });
         $("#page2OutputTextarea")[0].value += componentsDiv.find(".cardAnimationDiv")[0].outerHTML;
         $("#page2OutputTextarea")[0].value += "</div><script>" + cardStartup + "</script>";
         break;
      case 3: // Card Alternate
      case 4: // Flash Card
         componentsDiv.find(".cardFlipDiv > .cardFlipDivDiv").each(function () {
            let cardFlipDivDiv = $(this);
            let cardFlipFront = cardFlipDivDiv.children().eq(0)[0];
            let cardFlipBack = cardFlipDivDiv.children().eq(1)[0];

            // Remove contentEditable
            cardFlipFront.removeAttribute("ondblclick");
            cardFlipFront.removeAttribute("contenteditable");
            cardFlipFront.removeAttribute("style");
            cardFlipBack.removeAttribute("ondblclick");
            cardFlipBack.removeAttribute("contenteditable");
            cardFlipBack.removeAttribute("style");
         });
         $("#page2OutputTextarea")[0].value = componentsDiv.html();
         break;
      case 5: // Checklist
         let checkBoxTitle = componentsDiv.find(".checkBoxPageDiv > :first-child")[0];
         checkBoxTitle.removeAttribute("contenteditable");
         componentsDiv.find(".checkboxContainer").each(function () {
            let checkboxContainer = $(this);
            let checkboxInput = checkboxContainer.children().eq(0)[0];
            let checkboxLabel = checkboxContainer.children().eq(1)[0];

            checkboxLabel.htmlFor = checkboxInput.id;
            // Remove contentEditable
            checkboxLabel.removeAttribute("contenteditable");
         });
         $("#page2OutputTextarea")[0].value = componentsDiv.html();
         $("#page2OutputTextarea")[0].value += "<script>" + checklistStartup + "</script>";
         break;
      case 6: // Tabs
         let first = !0;
         componentsDiv.find(".tabComponentLinks").each(function () {
            let tabComponentLinks = this;
            if (first) {
               tabComponentLinks.className = "tabComponentLinks tabComponentActive";
               first = !1;
            } else {
               tabComponentLinks.className = "tabComponentLinks";
            }

            // Remove contentEditable
            tabComponentLinks.setAttribute("onclick", tabsOnClick);
            tabComponentLinks.removeAttribute("contenteditable");
         });
         first = !0;
         componentsDiv.find(".tabComponentContent").each(function () {
            let tabComponentContent = this;
            if (first) {
               tabComponentContent.className = "tabComponentContent tabActiveContent";
               first = !1;
            } else {
               tabComponentContent.className = "tabComponentContent";
            }

            // Remove contentEditable
            tabComponentContent.removeAttribute("contenteditable");
         });
         $("#page2OutputTextarea")[0].value = componentsDiv.html();
         break;
      case 7: // Lists
         componentsDiv.find(".fancyNumbers").each(function () {
            let fancyNumbers = $(this);
            let fancyNumbersCircle = fancyNumbers.children().eq(1)[0];
            let fancyNumbersContent = fancyNumbers.children().eq(2)[0];

            // Remove contentEditable
            fancyNumbersCircle.removeAttribute("contenteditable");
            fancyNumbersContent.removeAttribute("contenteditable");
         });
         componentsDiv.find("[type='color']").each(function () {
            $(this).remove();
         })
         $("#page2OutputTextarea")[0].value = componentsDiv.html();
         break;
      }

      animatePage2Out();
   }
}

function showPage3Modal() {
   $("#page2OutputModalDiv").modal("show");
}

function copyToClipboard() {
   $("#page2OutputTextarea")[0].select();
   document.execCommand("copy");
   $("#page2OutputTextarea ~ p").css("display", "block"); // Show after clicked
}

function flashCardCheckEnterKey(e) {
   if (e.keyCode === 13) {
      // insert 2 br tags (if only one br tag is inserted the cursor won't go to the next line)
      document.execCommand("insertHTML", false, "<br><h2>&nbsp;</h2>");
      // prevent the default behaviour of return key pressed
      return false;
   }
}

function checkEnterKey(e) {
   // trap the return key being pressed
   /*
   if (e.keyCode === 13) {
      // insert 2 br tags (if only one br tag is inserted the cursor won't go to the next line)
      document.execCommand("insertHTML", false, "<br><br>");
      // prevent the default behaviour of return key pressed
      return false;
   }
   */
   if (e.keyCode === 8) {
      if ($(this).html() === "<p><br></p>" || $(this).html() === "<h2><br></h2>") {
         // prevent the default behaviour of return key pressed
         return false;
      }
   }
}

function contentEditableBr() {
   // Make sure there is only one event attached
   $(document).off("keydown", "[contenteditable]", checkEnterKey);

   // Prevent creating div on enter
   $(document).on("keydown", "[contenteditable]", checkEnterKey);
}

// Check double click
function accordionDoubletap(element) {
   let now = new Date().getTime();
   let timesince = now - latestTap;
   if ((timesince < 400) && (timesince > 0)) {
      element.parentElement.className = 'accordion' === element.parentElement.className ? 'accordion expand' : 'accordion';
      if ($("#doubleClickAccordionHelp").html()) {
         $("#doubleClickAccordionHelp").remove();
         setTimeout(function () {
            addTooltip("To remove the accordion, click on the accordion", "removeSelectAccordionHelp", "page2BottomRightDiv", !1);
         }, 600);
      }
      latestTap = 0;
   } else {
      latestTap = new Date().getTime();
   }
}

function accordionAltDoubletap(element) {
   let now = new Date().getTime();
   let timesince = now - latestTap;
   if ((timesince < 400) && (timesince > 0)) {
      element.parentElement.className = 'accordionAlternate' === element.parentElement.className ? 'accordionAlternate expand' : 'accordionAlternate';
      if ($("#doubleClickAccordionHelp").html()) {
         $("#doubleClickAccordionHelp").remove();
         setTimeout(function () {
            addTooltip("To remove the accordion, click on the accordion", "removeSelectAccordionHelp", "page2BottomRightDiv", !1);
         }, 600);
      }
      latestTap = 0;
   } else {
      latestTap = new Date().getTime();
   }
}

function tabsDoubletap(element) {
   let now = new Date().getTime();
   let timesince = now - latestTap;
   if ((timesince < 400) && (timesince > 0)) {
      let elementIndex = Array.prototype.indexOf.call(element.parentNode.children, element);
      for (let a = element.parentElement.nextElementSibling.children, b = 0; b < a.length; b++) {
         if (b === elementIndex) {
            a[b].className = "tabComponentContent tabActiveContent";
         } else {
            a[b].className = "tabComponentContent";
         }
      }
      for (let a = element.parentElement.children, b = 0; b < a.length; b++) a[b].className = 'tabComponentLinks';
      element.className = (element.className === 'tabComponentLinks') ? 'tabComponentLinks tabComponentActive' : 'tabComponentLinks';
      if ($("#doubleClickTabHelp").html()) {
         $("#doubleClickTabHelp").remove();
         setTimeout(function () {
            addTooltip("To remove the Tab, click on the it", "removeTabSelectHelp", "page2BottomRightDiv", !1);
         }, 600);
      }
      latestTap = 0;
   } else {
      latestTap = new Date().getTime();
      if ($("#removeTabSelectHelp").html()) {
         $("#removeTabSelectHelp").remove();
         setTimeout(function () {
            addTooltip("Click on the Trash to remove Tab", "removeHelp", "page2BottomRightDiv", !1);
         }, 500);
      }
   }
}

// Sortable
function makeSortable() {
   // Making contentDivDiv sortable
   $("#componentsDiv").sortable({
      items: ".accordionDiv",
      handle: ".accordionDraggableDiv",
      axis: "y",
      cursor: "move",
      opacity: 0.5
   });
}

// Random word / number for Checklist
function getRandomWords() {
   let wordCount = 1;
   let randomWords;

   if (window.crypto && window.crypto.getRandomValues) {
      randomWords = new Int32Array(wordCount);
      window.crypto.getRandomValues(randomWords);
   } else if (window.msCrypto && window.msCrypto.getRandomValues) {
      randomWords = new Int32Array(wordCount);
      window.msCrypto.getRandomValues(randomWords);
   } else if (sjcl.random.isReady()) {
      randomWords = sjcl.random.randomWords(wordCount);
   } else {
      randomWords = [];
      for (let i = 0; i < wordCount; i++) {
         randomWords.push(isaac.rand());
      }
   }

   return randomWords;
};

// Card functions

function startupCard() {
   let cardSwipeDivDiv = document.getElementsByClassName("cardSwipeDivDiv");
   let oriPos;
   let latestTap = 0;

   for (i = 0; i != cardSwipeDivDiv.length; i++) {
      let cardSwipeDiv = cardSwipeDivDiv[i].getElementsByClassName("cardSwipeDiv");
      for (j = 0, k = cardSwipeDiv.length; j != cardSwipeDiv.length; j++, k--) {
         cardSwipeDiv[j].style.zIndex = k;
         if (cardSwipeDiv[j].style.display !== "none") {
            cardSwipeDiv[j].style.display = "flex";
            cardSwipeDiv[j].style.opacity = 1;
         }
      }
   }
}

function goLeft(clickedParent) {
   while (clickedParent && clickedParent.className !== "cardSwipeDivDiv") {
      clickedParent = clickedParent.parentElement;
   }
   let cardSwipeDivDivChildren = clickedParent.children;

   // Loop (i = 1 to prevent first)
   if (cardSwipeDivDivChildren[0].style.display === "none") {
      for (i = 1; i < cardSwipeDivDivChildren.length; i++) {
         if (cardSwipeDivDivChildren[i].style.display === "flex") {
            document.getElementById("cardBackButton").disabled = true;
            document.getElementById("cardNextButton").disabled = true;
            cardSwipeDivDivChildren[i].style.pointerEvents = "none";
            cardSwipeDivDivChildren[i - 1].style.pointerEvents = "none";
            cardSwipeDivDivChildren[i - 1].style.display = "flex";
            setTimeout(function () {
               cardSwipeDivDivChildren[i - 1].style.left = 0;
               cardSwipeDivDivChildren[i - 1].style.opacity = 1;
            }, 10);
            setTimeout(function () {
               cardSwipeDivDivChildren[i].style.pointerEvents = "auto";
               cardSwipeDivDivChildren[i - 1].style.pointerEvents = "auto";
               // Enable the Prev Slide Button
               document.getElementById("cardBackButton").disabled = false;
               document.getElementById("cardNextButton").disabled = false;
            }, 510);

            cardCurrentIndex--;
            break;
         }
      }
   }
   setCardIndicator();
}

function ifDblClicked(clickedParent) {
   let now = new Date().getTime();
   let timesince = now - latestTap;
   if ((timesince < 400) && (timesince > 0)) {
      let cardSwipeDivDivChildren = $(".cardSwipeDivDiv > .cardSwipeDiv");
      // Loop (-1 to prevent last)
      for (i = 0; i < cardSwipeDivDivChildren.length - 1; i++) {
         if (cardSwipeDivDivChildren.eq(i).css("display") === "flex") {
            document.getElementById("cardBackButton").disabled = true;
            document.getElementById("cardNextButton").disabled = true;
            cardSwipeDivDivChildren.eq(i)[0].style.pointerEvents = "none";
            cardSwipeDivDivChildren.eq(i + 1)[0].style.pointerEvents = "none";
            cardSwipeDivDivChildren.eq(i)[0].style.left = "-50px";
            cardSwipeDivDivChildren.eq(i)[0].style.opacity = 0;
            setTimeout(function () {
               cardSwipeDivDivChildren.eq(i)[0].style.pointerEvents = "auto";
               cardSwipeDivDivChildren.eq(i + 1)[0].style.pointerEvents = "auto";
               cardSwipeDivDivChildren.eq(i)[0].style.display = "none";
               document.getElementById("cardBackButton").disabled = false;
               document.getElementById("cardNextButton").disabled = false;
            }, 500);
            cardCurrentIndex++;
            break;
         }
      }
      setCardIndicator();
      if ($("#viewNextHelp").html()) {
         $("#viewNextHelp").remove();
         setTimeout(function () {
            addTooltip("Clicking on the Trash will remove the card on the current page", "removeHelp", "page2BottomRightDiv", !1);
            tooltipShowPositionCheck();
         }, 1500);
      }
      latestTap = 0;
   } else {
      latestTap = new Date().getTime();
   }

}

function ifDblClicked2() {
   let cardSwipeDivDivChildren = $(".cardSwipeDivDiv > .cardSwipeDiv");
   // Loop (-1 to prevent last)
   for (i = 0; i < cardSwipeDivDivChildren.length - 1; i++) {
      if (cardSwipeDivDivChildren.eq(i).css("display") === "flex") {
         document.getElementById("cardBackButton").disabled = true;
         document.getElementById("cardNextButton").disabled = true;
         cardSwipeDivDivChildren.eq(i)[0].style.pointerEvents = "none";
         cardSwipeDivDivChildren.eq(i + 1)[0].style.pointerEvents = "none";
         cardSwipeDivDivChildren.eq(i)[0].style.left = "-50px";
         cardSwipeDivDivChildren.eq(i)[0].style.opacity = 0;
         setTimeout(function () {
            cardSwipeDivDivChildren.eq(i)[0].style.pointerEvents = "auto";
            cardSwipeDivDivChildren.eq(i + 1)[0].style.pointerEvents = "auto";
            cardSwipeDivDivChildren.eq(i)[0].style.display = "none";
            document.getElementById("cardBackButton").disabled = false;
            document.getElementById("cardNextButton").disabled = false;
         }, 500);
         cardCurrentIndex++;
         break;
      }
   }
   setCardIndicator();
   if ($("#viewNextHelp").html()) {
      $("#viewNextHelp").remove();
      setTimeout(function () {
         addTooltip("Clicking on the Trash will remove the card on the current page", "removeHelp", "page2BottomRightDiv", !1);
         tooltipShowPositionCheck();
      }, 1500);
   }
}
// Number list function
function getNumberListIndex() {
   numberListIndex = document.getElementsByClassName("fancyNumbers").length + 1;
}

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

// Checklist functions
let checklistStartup = "document.querySelectorAll('.checkboxContainer input').forEach(function(a){'true'===localStorage.getItem(a.id)&&(a.checked=!0)})";

// Tabs functions
let tabsOnClick = "for(var elementIndex=Array.prototype.indexOf.call(this.parentNode.children,this),a=this.parentElement.nextElementSibling.children,b=0;b<a.length;b++)a[b].className=b===elementIndex?'tabComponentContent tabActiveContent':'tabComponentContent';for(var a$0=this.parentElement.children,b$1=0;b$1<a$0.length;b$1++)a$0[b$1].className='tabComponentLinks';this.className='tabComponentLinks'===this.className?'tabComponentLinks tabComponentActive':'tabComponentLinks'";

// Messy stuff
// CardStartup script
let cardStartup = "var cardSwipeDivDiv=document.getElementsByClassName('cardSwipeDivDiv'),oriPos,latestTap=0;for(i=0;i!=cardSwipeDivDiv.length;i++){var cardSwipeDiv=cardSwipeDivDiv[i].getElementsByClassName('cardSwipeDiv');j=0;for(k=cardSwipeDiv.length;j!=cardSwipeDiv.length;j++,k--)cardSwipeDiv[j].style.zIndex=k,cardSwipeDiv[j].style.display='flex',cardSwipeDiv[j].style.opacity=1};";

// Mousedown / Touchstart
let cardMouseDown = "oriPos=event.clientX;void 0==oriPos&&(oriPos=event.changedTouches[0].clientX);";

// Mouseup
let cardMouseUp = "var nowCursor=event.clientX;void 0==nowCursor&&(nowCursor=event.changedTouches[0].clientX);for(var clickedParent=this;'cardSwipeDivDiv'!==clickedParent.className;)clickedParent=clickedParent.parentElement;if(nowCursor<oriPos-.16*clickedParent.clientWidth){var cardSwipeDivDivChildren=clickedParent.children;for(i=0;i<cardSwipeDivDivChildren.length-1;i++)if('flex'===cardSwipeDivDivChildren[i].style.display){cardSwipeDivDivChildren[i].style.pointerEvents='none';cardSwipeDivDivChildren[i+1].style.pointerEvents='none';cardSwipeDivDivChildren[i].style.left='-50px';cardSwipeDivDivChildren[i].style.opacity=0;setTimeout(function(){cardSwipeDivDivChildren[i].style.pointerEvents='auto';cardSwipeDivDivChildren[i+1].style.pointerEvents='auto';cardSwipeDivDivChildren[i].style.display='none'},500);break}}else if(nowCursor>oriPos+.16*clickedParent.clientWidth&&(cardSwipeDivDivChildren=clickedParent.children,'none'===cardSwipeDivDivChildren[0].style.display))for(i=1;i<cardSwipeDivDivChildren.length;i++)if('flex'===cardSwipeDivDivChildren[i].style.display){cardSwipeDivDivChildren[i].style.pointerEvents='none';cardSwipeDivDivChildren[i-1].style.pointerEvents='none';cardSwipeDivDivChildren[i-1].style.display='flex';setTimeout(function(){cardSwipeDivDivChildren[i-1].style.left=0;cardSwipeDivDivChildren[i-1].style.opacity=1},10);setTimeout(function(){cardSwipeDivDivChildren[i].style.pointerEvents='auto';cardSwipeDivDivChildren[i-1].style.pointerEvents='auto'},510);break};";

// DblClick
let cardDblClick = "let now=(new Date).getTime(),timesince=now-latestTap;if(400>timesince&&0<timesince){for(var clickedParent=event.target;'cardSwipeDivDiv'!==clickedParent.className;)clickedParent=clickedParent.parentElement;let cardSwipeDivDivChildren=clickedParent.children;for(i=0;i<cardSwipeDivDivChildren.length-1;i++)if('flex'===cardSwipeDivDivChildren[i].style.display){cardSwipeDivDivChildren[i].style.pointerEvents='none';cardSwipeDivDivChildren[i+1].style.pointerEvents='none';cardSwipeDivDivChildren[i].style.left='-50px';cardSwipeDivDivChildren[i].style.opacity=0;setTimeout(function(){cardSwipeDivDivChildren[i].style.pointerEvents='auto';cardSwipeDivDivChildren[i+1].style.pointerEvents='auto';cardSwipeDivDivChildren[i].style.display='none'},500);break}latestTap=0}else latestTap=(new Date).getTime();";
