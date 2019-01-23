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
let cardCurrent;
let cardCurrentIndex;
// To track number list index
let numberListIndex;
// Elements to be removed
let selectedAccordionForDeletion, selectedFlashCardForDeletion, selectedChecklistForDeletion, selectedTabForDeletion, selectedNumberListForDeletion;
// Track double click
let latestTap;

$(function() {
   // Random generator for checklist
   sjcl.random.startCollectors();
   // Check if elements need to be animated for page1
   checkElement();

   require([
      "js/codemirror-5.42.2/lib/codemirror", "js/codemirror-5.42.2/mode/htmlmixed/htmlmixed", "js/codemirror-5.42.2/addon/selection/active-line"
   ], function(CodeMirror) {
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

   // Remember to <break;> otherwise will freeze the browser
   $(document).on("click", function(e) {
      let i = 0;
      let nodeYouWant = e.target;
      while (nodeYouWant && i < 3) {
         if (nodeYouWant.className === "accordionDiv") {
            selectedAccordionForDeletion = nodeYouWant;
            break;
         } else if (nodeYouWant.className === "cardFlipDiv") {
            selectedFlashCardForDeletion = nodeYouWant;
            break;
         } else if (nodeYouWant.className === "checkboxContainer") {
            selectedChecklistForDeletion = nodeYouWant;
            break;
         } else if (nodeYouWant.classList.contains("tabComponentLinks") || nodeYouWant.classList.contains("tabComponentContent")) {
            selectedTabForDeletion = Array.prototype.indexOf.call(nodeYouWant.parentElement.children, nodeYouWant);
            break;
         } else if (nodeYouWant.className === "fancyNumbers") {
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
   })
});

function checkElement() {
   for (i = 0; i < elementsArray.length; i++) {
      let element = document.getElementById(elementsArray[i]);
      if ($(element).css("opacity") == 1) {
         continue;
      }
      if (window.pageYOffset >= ($(element).position().top - $(window).height() * 0.8)) {
         animateElement(element);
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

function animatePage1Out() {
   document.body.scrollTop = 0;
   document.documentElement.scrollTop = 0;
   $("body").css("overflow", "hidden");
   // Show page2
   let page2 = $("#page2");
   page2.css("display", "flex");
   page2.css("position", "absolute");
   page2.css("top", "0");
   page2.css("left", "0");

   // Hide page1
   let page1 = $("#page1");
   page1.hide("fold", 1200, function() {
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
   page1.show("fold", 1200, function() {
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
   }, 1200, function() {
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
   }, 1200, function() {
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
   page1.show("fold", 1200, function() {
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
   animatePage1Out();

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
         loadImportedAccordion(tempDiv);
         return !0;
      } else if(tempDiv.find(".accordionAlternate").html()) {
         loadImportedAccordionAlt(tempDiv);
         return !0;
      } else if (tempDiv.find(".cardAnimationDiv").html()) {
         loadImportedCard(tempDiv);
         return !0;
      } else if (tempDiv.find(".cardFlipMasterDiv").html()) {
         loadImportedFlashCardPreset(tempDiv);
         return !0;
      } else if (tempDiv.find(".checkBoxPageDiv").html()) {
         loadImportedChecklistPreset(tempDiv);
         return !0;
      } else if (tempDiv.find(".tabComponent").html()) {
         loadImportedTabsPreset(tempDiv);
         return !0;
      } else if (tempDiv.find(".fancyNumbers").html()) {
         loadImportedNumberListPreset(tempDiv);
         return !0;
      }
   }
   alert("Code does not match. Make sure you copied correctly");
}

function loadImportedAccordion(tempDiv) {
   $("#componentsDiv").empty();

   tempDiv.find(".accordion").each(function() {
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
   animatePage1Out();
}

function loadImportedAccordionAlt(tempDiv) {
   $("#componentsDiv").empty();

   tempDiv.find(".accordionAlternate").each(function() {
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
   animatePage1Out();
}

function loadImportedCard(tempDiv) {
   $("#componentsDiv").empty();

   tempDiv.find(".cardSwipeDiv").each(function() {
      this.removeAttribute("onmousedown");
      this.removeAttribute("onmouseup");
      this.removeAttribute("ontouchstart");
      this.removeAttribute("ontouchend");
      this.setAttribute("ondblclick", "ifDblClicked(this)");

      this.children[0].contentEditable = "true";
   });

   $("#componentsDiv").append(tempDiv.children().first());

   // Div to contain the buttons
   let cardIndicatorDiv = document.createElement("div");
   cardIndicatorDiv.id = "cardIndicatorDiv";
   // Adding buttons for navigation
   let backBtn = document.createElement("button");
   backBtn.className = "btn btn-info";
   backBtn.id = "cardBackButton";
   backBtn.setAttribute("onclick", "goLeft(this.parentElement.previousElementSibling.children[0])");
   backBtn.appendChild(document.createTextNode("View Previous Slide"));
   let forwardBtn = document.createElement("button");
   forwardBtn.className = "btn btn-info";
   forwardBtn.id = "cardNextButton";
   forwardBtn.setAttribute("onclick", "ifDblClicked(this.parentElement.previousElementSibling.children[0])");
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
   animatePage1Out();
}

function loadImportedFlashCardPreset(tempDiv) {
   $("#componentsDiv").empty();

   tempDiv.find(".cardFlipDivDiv").each(function() {
      let cardFlipFront = $(this).find(".cardFlipFront")[0];
      let cardFlipBack = $(this).find(".cardFlipBack")[0];

      cardFlipFront.setAttribute("ondblclick", "this.style.display='none'");
      cardFlipFront.contentEditable = "true";
      cardFlipBack.setAttribute("ondblclick", "this.previousElementSibling.style.display='flex'");
      cardFlipBack.contentEditable = "true";
   });

   $("#componentsDiv").append(tempDiv.children().first());
   isAccordion = 4;
   $("#page2TopBarDivTitle > p").text("Card");
   hideImportModal();
   animatePage1Out();
}

function loadImportedChecklistPreset(tempDiv) {
   $("#componentsDiv").empty();

   tempDiv.children().first()[0].contentEditable = "true";
   tempDiv.find(".checkboxContainer").each(function() {
      let checkboxContainerCheckmark = $(this).find(".checkboxContainerCheckmark");
      checkboxContainerCheckmark[0].removeAttribute("for");
      checkboxContainerCheckmark.contentEditable = "true";
   });

   $("#componentsDiv").append(tempDiv.children().first());
   isAccordion = 5;
   $("#page2TopBarDivTitle > p").text("Checklist");
   hideImportModal();
   animatePage1Out();
}

function loadImportedTabsPreset(tempDiv) {
   $("#componentsDiv").empty();

   tempDiv.find(".tabComponentLinks:not(.tabComponentLinksClear)").each(function() {
      let tabComponentLinks = this;
      tabComponentLinks.className = "tabComponentLinks";
      tabComponentLinks.removeAttribute("onclick");
      tabComponentLinks.contentEditable = "true";
      tabComponentLinks.setAttribute("ondblclick", tabsOnClick);
   });
   tempDiv.find(".tabComponentContentDiv").each(function() {
      let tabComponentContentDiv = this;
      tabComponentContentDiv.className = "tabComponentContentDiv";
      tabComponentContentDiv.contentEditable = "true";
   });

   tempDiv.find(".tabComponentLinks").eq(0)[0].className = "tabComponentLinks tabComponentActive";
   tempDiv.find(".tabComponentContentDiv").eq(0)[0].className = "tabComponentContentDiv tabActiveContent";
   $("#componentsDiv").html(tempDiv.html());
   isAccordion = 6;
   $("#page2TopBarDivTitle > p").text("Tabs");
   hideImportModal();
   animatePage1Out();
}

function loadImportedNumberListPreset(tempDiv) {
   $("#componentsDiv").empty();

   tempDiv.find(".fancyNumbers").each(function() {
      let fancyNumbers = $(this);
      fancyNumbers.find(".fancyNumbersCircle")[0].contentEditable = "true";
      fancyNumbers.find(".fancyNumbersCircle ~ *")[0].contentEditable = "true";
   });

   $("#componentsDiv").html(tempDiv.html());
   isAccordion = 7;
   $("#page2TopBarDivTitle > p").text("Tabs");
   hideImportModal();
   animatePage1Out();
}

function showTemplates() {
   let page2BottomLeftDivLeftDiv = document.getElementById("page2BottomLeftDivLeftDiv");
   if ($(page2BottomLeftDivLeftDiv).hasClass("expand")) {
      if (document.getElementById("templateMainDiv").style.display === "none") {
         document.getElementById("hiddenCodeTextarea").style.display = "none";
         document.getElementById("templateMainDiv").style.display = "flex";
      } else {
         page2BottomLeftDivLeftDiv.className = "";
      }
   } else {
      document.getElementById("hiddenCodeTextarea").style.display = "none";
      document.getElementById("templateMainDiv").style.display = "flex";
      page2BottomLeftDivLeftDiv.className = "expand";
   }
}

function showRightTemplate(labelDiv, index) {
   if (labelDiv.className !== "templateSelectionLabelDiv active") {
      $("#templateMainDivLeft").children().each(function() {
         this.className = "templateSelectionLabelDiv";
      });
      labelDiv.className = "templateSelectionLabelDiv active";
      let photoArray = [];
      let obj;
      let obj2;
      switch (index) {
         case 0:
            obj = {
               src: "images/Accordion.png",
               alt: "Accordion Template",
               onclick: "loadAccordionPreset()",
               text: "Accordion"
            };
            obj2 = {
               src: "images/AccordionAlt.png",
               alt: "Accordion Alternate Template",
               onclick: "loadAccordionAltPreset()",
               text: "Accordion (Alt)"
            };
            photoArray.push(obj);
            photoArray.push(obj2);
            break;
         case 1:
            obj = {
               src: "images/Card.png",
               alt: "Card Template",
               onclick: "loadCardPreset()",
               text: "Card"
            };
            obj2 = {
               src: "images/FlashCard.png",
               alt: "Flashcard Template",
               onclick: "loadFlashCardPreset()",
               text: "Flash Card"
            };
            photoArray.push(obj);
            photoArray.push(obj2);
            break;
         case 2:
            obj = {
               src: "images/Checklist.png",
               alt: "Checklist Template",
               onclick: "loadChecklistPreset()",
               text: "Checklist"
            };
            photoArray.push(obj);
            break;
         case 3:
            obj = {
               src: "images/Tabs.png",
               alt: "Tabs Template",
               onclick: "loadTabsPreset()",
               text: "Tabs"
            };
            photoArray.push(obj);
            break;
         case 4:
            obj = {
               src: "images/NumberList.png",
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
         setTimeout(function() {
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
   }
}

// Components Presets
function loadAccordionPreset() {
   showTemplates();
   isAccordion = 0;
   $("#page2TopBarDivTitle > p").text("Accordion");
   let componentsDiv = document.getElementById("componentsDiv");
   let accordionDiv = addNewAccordion();
   $(componentsDiv).empty();
   componentsDiv.appendChild(accordionDiv);
   makeSortable();
}

function loadAccordionAltPreset() {
   showTemplates();
   isAccordion = 1;
   $("#page2TopBarDivTitle > p").text("Accordion Alternate");
   let componentsDiv = document.getElementById("componentsDiv");
   let accordionDiv = addNewAltAccordion();
   $(componentsDiv).empty();
   componentsDiv.appendChild(accordionDiv);
   makeSortable();
}

function loadCardPreset() {
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
   cardSwipeDivDiv.appendChild(addNewCard());
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
   backBtn.setAttribute("onclick", "goLeft(this.parentElement.previousElementSibling.children[0])");
   backBtn.appendChild(document.createTextNode("View Previous Slide"));
   let forwardBtn = document.createElement("button");
   forwardBtn.className = "btn btn-info";
   forwardBtn.id = "cardNextButton";
   forwardBtn.setAttribute("onclick", "ifDblClicked(this.parentElement.previousElementSibling.children[0])");
   forwardBtn.appendChild(document.createTextNode("View Next Slide"));

   let totalCardChild = $(".cardAnimationDiv").children().length;
   let cardIndexIndicator = document.createElement("p");
   cardIndexIndicator.id = "cardIndexIndicator";
   cardIndexIndicator.className = "text-success";

   cardIndicatorDiv.appendChild(backBtn);
   cardIndicatorDiv.appendChild(cardIndexIndicator);
   cardIndicatorDiv.appendChild(forwardBtn);
   componentsDiv.appendChild(cardIndicatorDiv);

   setCardIndicator();
}

function loadFlashCardPreset() {
   showTemplates();
   isAccordion = 4;
   $("#page2TopBarDivTitle > p").text("Flash Card");
   let componentsDiv = document.getElementById("componentsDiv");
   let cardFlipMasterDiv = document.createElement("div");
   cardFlipMasterDiv.className = "cardFlipMasterDiv";
   let cardFlipDiv = addNewFlashCard();
   $(componentsDiv).empty();
   cardFlipMasterDiv.appendChild(cardFlipDiv);
   componentsDiv.appendChild(cardFlipMasterDiv);
}

function loadChecklistPreset() {
   showTemplates();
   isAccordion = 5;
   $("#page2TopBarDivTitle > p").text("Checklist");
   let componentsDiv = document.getElementById("componentsDiv");
   let checkBoxPageDiv = document.createElement("div");
   checkBoxPageDiv.className = "checkBoxPageDiv";
   let checkBoxPageDivP = document.createElement("p");
   checkBoxPageDivP.appendChild(document.createTextNode("Type Here"));
   checkBoxPageDivP.contentEditable = "true";

   checkBoxPageDiv.appendChild(checkBoxPageDivP);
   checkBoxPageDiv.appendChild(addNewChecklist());
   $(componentsDiv).empty();
   componentsDiv.appendChild(checkBoxPageDiv);
}

function loadTabsPreset() {
   showTemplates();
   isAccordion = 6;
   $("#page2TopBarDivTitle > p").text("Tabs");
   let componentsDiv = document.getElementById("componentsDiv");
   let tabComponent = document.createElement("div");
   tabComponent.className = "tabComponent";
   let tabComponentLinks = document.createElement("div");
   tabComponentLinks.className = "tabComponentLinks tabComponentActive";
   tabComponentLinks.setAttribute("ondblclick", tabsOnClick);
   tabComponentLinks.contentEditable = "true";
   let tabComponentLinksP = document.createElement("p");
   tabComponentLinksP.appendChild(document.createTextNode("Type Here"));
   let tabComponentContentDiv = document.createElement("div");
   tabComponentContentDiv.className = "tabComponentContentDiv";
   let tabComponentContent = document.createElement("div");
   tabComponentContent.className = "tabComponentContent tabActiveContent";
   tabComponentContent.contentEditable = "true";
   let tabComponentContentP = document.createElement("p");
   tabComponentContentP.appendChild(document.createTextNode("Type Here"));

   // For clearing
   let tabComponentLinksClear = document.createElement("div");
   tabComponentLinksClear.className = "tabComponentLinks tabComponentLinksClear";

   tabComponentLinks.appendChild(tabComponentLinksP);
   tabComponent.appendChild(tabComponentLinks);
   tabComponent.appendChild(tabComponentLinksClear);
   tabComponentContent.appendChild(tabComponentContentP);
   tabComponentContentDiv.appendChild(tabComponentContent);
   $(componentsDiv).empty();
   componentsDiv.appendChild(tabComponent);
   componentsDiv.appendChild(tabComponentContentDiv);
   contentEditableBr();
}

function loadNumberListPreset() {
   showTemplates();
   isAccordion = 7;
   $("#page2TopBarDivTitle > p").text("Lists");
   let componentsDiv = document.getElementById("componentsDiv");
   $(componentsDiv).empty();
   componentsDiv.appendChild(addNewNumberList());
   getNumberListIndex();
}

// Adding and Removing
// 3 was intended to be Card (Alt), he's dead...
function addNewSection() {
   switch (isAccordion) {
      case 0:
         document.getElementById("componentsDiv").appendChild(addNewAccordion());
         makeSortable();
         break;
      case 1:
         document.getElementById("componentsDiv").appendChild(addNewAltAccordion());
         makeSortable();
         break;
      case 2:
         let newCard = addNewCard();
         document.getElementsByClassName("cardSwipeDivDiv")[0].appendChild(newCard);
         startupCard();
         setCardIndicator();
         break;
      case 4:
         document.getElementsByClassName("cardFlipMasterDiv")[0].appendChild(addNewFlashCard());
         break;
      case 5:
         $(".checkBoxPageDiv").append(addNewChecklist());
         break;
      case 6:
         let newTab = addNewTabs();
         $(".tabComponent").append(newTab.tabComponentLinksTab);
         $(".tabComponentContentDiv").append(newTab.tabComponentContentTab);
         $(".tabComponentLinksClear").remove();
         break;
      case 7:
         $("#componentsDiv").append(addNewNumberList());
         break;
      default:
         break;
   }
   setHiddenHTML();
}

function removeSection() {
   switch (isAccordion) {
      case 0:
      case 1:
         if (selectedAccordionForDeletion) {
            $(selectedAccordionForDeletion).remove();
         }
         break;
      case 2:
      case 3:
         let cardSwipeDivDivChildren = cardCurrent.parentElement.children;
         for (i = 0; i < cardSwipeDivDivChildren.length; i++) {
            // Not first
            if (cardSwipeDivDivChildren[i].style.display === "flex" && i >= 1) {
               document.getElementById("cardBackButton").disabled = true;
               document.getElementById("cardNextButton").disabled = true;
               goLeft(document.getElementsByClassName("cardSwipeDivDiv")[0]);
               setTimeout(function() {
                  cardCurrent.parentElement.removeChild(cardSwipeDivDivChildren[i]);
                  // Enable the Prev Slide Button
                  document.getElementById("cardBackButton").disabled = false;
                  document.getElementById("cardNextButton").disabled = false;
                  setCardIndicator();
               }, 510);
               cardCurrent = cardSwipeDivDivChildren[i - 1];
               break;
            } else if (cardSwipeDivDivChildren[i].style.display === "flex" && i === 0) {
               document.getElementById("cardBackButton").disabled = true;
               document.getElementById("cardNextButton").disabled = true;
               cardCurrentIndex--;
               ifDblClicked(document.getElementsByClassName("cardSwipeDivDiv")[0]);
               setTimeout(function() {
                  cardCurrent.parentElement.removeChild(cardSwipeDivDivChildren[i]);
                  // Enable the Prev Slide Button
                  document.getElementById("cardBackButton").disabled = false;
                  document.getElementById("cardNextButton").disabled = false;
                  setCardIndicator();
               }, 500);
               cardCurrent = cardSwipeDivDivChildren[i + 1];
               break;
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
            let tabComponent = document.getElementsByClassName("tabComponent")[0];
            let tabComponentContentDiv = document.getElementsByClassName("tabComponentContentDiv")[0];
            try {
               tabComponent.removeChild(tabComponent.childNodes[selectedTabForDeletion]);
               tabComponentContentDiv.removeChild(tabComponentContentDiv.childNodes[selectedTabForDeletion]);
            } catch (e) {
               console.log(e.message);
            }

            // Open previous or next tab is no active
            let gotActive = !1;
            $(tabComponent).children().each(function() {
               if(this.className==="tabComponentLinks tabComponentActive") {
                  gotActive = !0;
               }
            });
            $(tabComponentContentDiv).children().each(function() {
               if(this.className==="tabComponentContent tabActiveContent") {
                  gotActive = !0;
               }
            });
            if ($(".tabComponentLinks:not(.tabComponentLinksClear)").length >= 1 && !gotActive) {
               selectedTabForDeletion--;
               tabComponent.children[selectedTabForDeletion].className = "tabComponentLinks tabComponentActive";
               tabComponentContentDiv.children[selectedTabForDeletion].className = "tabComponentContent tabActiveContent";
            } else {
               tabComponent.children[selectedTabForDeletion].className = "tabComponentLinks tabComponentActive";
               tabComponentContentDiv.children[selectedTabForDeletion].className = "tabComponentContent tabActiveContent";
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
function addNewAccordion() {
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
   accordionTitle.appendChild(document.createTextNode("Enter Title Here"));
   let accordionContent = document.createElement("div");
   // Contenteditable for editing... remember to change on output
   accordionContent.className = "accordionContent";
   accordionContent.contentEditable = "true";
   accordionContent.innerHTML = "<p>Enter Content Here</p>";

   contentEditableBr();

   accordionTitleDiv.appendChild(accordionTitle);
   accordionDiv.appendChild(accordionTitleDiv);
   accordionDiv.appendChild(accordionContent);

   accordionDivDiv.appendChild(accordionDraggableDiv);
   accordionDivDiv.appendChild(accordionDiv);

   return accordionDivDiv;
}

function addNewAltAccordion() {
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
   accordionTitle.appendChild(document.createTextNode("Enter Title Here"));
   contentEditableBr();

   let accordionContent = document.createElement("div");
   // Contenteditable for editing... remember to change on output
   accordionContent.className = "accordionAlternateContent";
   accordionContent.contentEditable = "true";
   accordionContent.innerHTML = "<p>Enter Content Here</p>";

   contentEditableBr();

   accordionTitleDiv.appendChild(accordionTitle);
   accordionDiv.appendChild(accordionTitleDiv);
   accordionDiv.appendChild(accordionContent);

   accordionDivDiv.appendChild(accordionDraggableDiv);
   accordionDivDiv.appendChild(accordionDiv);

   return accordionDivDiv;
}

function addNewCard() {
   let cardSwipeDiv = document.createElement("div");
   cardSwipeDiv.className = "cardSwipeDiv";
   cardSwipeDiv.setAttribute("ondblclick", "ifDblClicked(this)");
   let cardAnimationDivTitle = document.createElement("p");
   cardAnimationDivTitle.contentEditable = "true";
   cardAnimationDivTitle.appendChild(document.createTextNode("Type here"));
   let cardSwipeContent = document.createElement("div");
   cardSwipeContent.className = "cardSwipeContent";
   cardSwipeContent.contentEditable = "true";
   let cardSwipeContentP = document.createElement("p");
   cardSwipeContentP.appendChild(document.createTextNode("Type here"));

   cardSwipeContent.appendChild(cardSwipeContentP);
   cardSwipeDiv.appendChild(cardAnimationDivTitle);
   cardSwipeDiv.appendChild(cardSwipeContent);

   contentEditableBr();

   if (!cardCurrent) {
      cardCurrent = cardSwipeDiv;
   }

   return cardSwipeDiv;
}

function setCardIndicator() {
   $("#cardIndexIndicator").html((cardCurrentIndex + 1) + " <span style='color:#6c757d'>-</span> <span style='color:#dc3545'>" + $(".cardSwipeDivDiv").children().length + "</span>");
}

function addNewFlashCard() {
   let cardFlipDiv = document.createElement("div");
   cardFlipDiv.className = "cardFlipDiv";
   let cardFlipDivDiv = document.createElement("div");
   cardFlipDivDiv.className = "cardFlipDivDiv";
   let cardFlipFront = document.createElement("div");
   cardFlipFront.className = "cardFlipFront";
   cardFlipFront.setAttribute("ondblclick", "this.style.display='none'");
   cardFlipFront.contentEditable = "true";
   let cardFlipFrontP = document.createElement("p");
   cardFlipFrontP.appendChild(document.createTextNode("Type Here"));
   let cardFlipBack = document.createElement("div");
   cardFlipBack.className = "cardFlipBack";
   cardFlipBack.setAttribute("ondblclick", "this.previousElementSibling.style.display='flex'");
   let cardFlipBackP = document.createElement("p");
   cardFlipBackP.appendChild(document.createTextNode("Type Here"));
   cardFlipBack.contentEditable = "true";

   cardFlipFront.appendChild(cardFlipFrontP);
   cardFlipBack.appendChild(cardFlipBackP);
   cardFlipDivDiv.appendChild(cardFlipFront);
   cardFlipDivDiv.appendChild(cardFlipBack);
   cardFlipDiv.appendChild(cardFlipDivDiv);

   contentEditableBr();
   return cardFlipDiv;
}

function addNewChecklist() {
   let randomGenerated = getRandomWords();
   let checkboxContainer = document.createElement("div");
   checkboxContainer.className = "checkboxContainer";
   let checkboxContainerCheckbox = document.createElement("input");
   checkboxContainerCheckbox.setAttribute("onchange", "localStorage.setItem(this.id, this.checked)");
   checkboxContainerCheckbox.type = "checkbox";
   checkboxContainerCheckbox.id = randomGenerated;
   let checkboxContainerCheckboxLabel = document.createElement("label");
   checkboxContainerCheckboxLabel.className = "checkboxContainerCheckmark";
   checkboxContainerCheckboxLabel.appendChild(document.createTextNode("Type Here"));
   checkboxContainerCheckboxLabel.contentEditable = "true";

   checkboxContainer.appendChild(checkboxContainerCheckbox);
   checkboxContainer.appendChild(checkboxContainerCheckboxLabel);

   return checkboxContainer;
}

function addNewTabs() {
   let tabComponentLinks = document.createElement("div");
   tabComponentLinks.className = "tabComponentLinks";
   tabComponentLinks.setAttribute("ondblclick", tabsOnClick);
   tabComponentLinks.contentEditable = "true";
   let tabComponentLinksP = document.createElement("p");
   tabComponentLinksP.appendChild(document.createTextNode("Type Here"));
   let tabComponentContent = document.createElement("div");
   tabComponentContent.className = "tabComponentContent";
   tabComponentContent.contentEditable = "true";
   let tabComponentContentP = document.createElement("p");
   tabComponentContentP.appendChild(document.createTextNode("Type Here"));

   tabComponentLinks.appendChild(tabComponentLinksP);
   tabComponentContent.appendChild(tabComponentContentP);
   contentEditableBr();

   return {
      tabComponentLinksTab: tabComponentLinks,
      tabComponentContentTab: tabComponentContent
   }
}

function addNewNumberList() {
   getNumberListIndex();
   let fancyNumbers = document.createElement("div");
   fancyNumbers.className = "fancyNumbers";
   let fancyNumbersCircle = document.createElement("div");
   fancyNumbersCircle.className = "fancyNumbersCircle";
   fancyNumbersCircle.contentEditable = "true";
   let fancyNumbersCircleP = document.createElement("p");
   fancyNumbersCircleP.appendChild(document.createTextNode(numberListIndex));
   let fancyNumbersContent = document.createElement("div");
   fancyNumbersContent.contentEditable = "true";
   let fancyNumbersContentP = document.createElement("p");
   fancyNumbersContentP.appendChild(document.createTextNode("Type Here"));
   contentEditableBr();

   fancyNumbersCircle.appendChild(fancyNumbersCircleP);
   fancyNumbersContent.appendChild(fancyNumbersContentP);
   fancyNumbers.appendChild(fancyNumbersCircle);
   fancyNumbers.appendChild(fancyNumbersContent);

   return fancyNumbers;
}

// Hidden HTML
function toggleHiddenCodes() {
   let page2BottomLeftDivLeftDiv = document.getElementById("page2BottomLeftDivLeftDiv");
   if ($(page2BottomLeftDivLeftDiv).hasClass("expand")) {
      if (document.getElementById("hiddenCodeTextarea").style.display === "none") {
         document.getElementById("templateMainDiv").style.display = "none";
         document.getElementById("hiddenCodeTextarea").style.display = "flex";
      } else {
         page2BottomLeftDivLeftDiv.className = "";
      }
   } else {
      document.getElementById("templateMainDiv").style.display = "none";
      document.getElementById("hiddenCodeTextarea").style.display = "flex";
      page2BottomLeftDivLeftDiv.className = "expand";
   }
   setHiddenHTML();
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
   if($("#componentsDiv").html()) {
      $("#page2OutputTextarea").val("");
      $("#tempDiv").empty();
      let componentsDiv = $("#componentsDiv").clone();
      switch (isAccordion) {
         case 0: // Accordion
            componentsDiv.find(".accordion").each(function() {
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
            componentsDiv.find(".accordionAlternate").each(function() {
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
            componentsDiv.find(".cardAnimationDiv > .cardSwipeDivDiv > .cardSwipeDiv").each(function() {
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
            componentsDiv.find(".cardFlipDiv > .cardFlipDivDiv").each(function() {
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
            componentsDiv.find(".checkboxContainer").each(function() {
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
            componentsDiv.find(".tabComponentLinks").each(function() {
               let tabComponentLinks = this;
               if (first) {
                  tabComponentLinks.className = "tabComponentLinks tabComponentActive";
                  first = !1;
               } else {
                  tabComponentLinks.className = "tabComponentLinks";
               }

               // Remove contentEditable
               tabComponentLinks.setAttribute("onclick", tabsOnClick);
               tabComponentLinks.removeAttribute("ondblclick");
               tabComponentLinks.removeAttribute("contenteditable");
            });
            first = !0;
            componentsDiv.find(".tabComponentContent").each(function() {
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
            componentsDiv.find(".fancyNumbers").each(function() {
               let fancyNumbers = $(this);
               let fancyNumbersCircle = fancyNumbers.children().eq(0)[0];
               let fancyNumbersContent = fancyNumbers.children().eq(1)[0];

               // Remove contentEditable
               fancyNumbersCircle.removeAttribute("contenteditable");
               fancyNumbersContent.removeAttribute("contenteditable");
            });
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
      latestTap = 0;
      return !1;
   } else {
      latestTap = new Date().getTime();
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
            setTimeout(function() {
               cardSwipeDivDivChildren[i - 1].style.left = 0;
               cardSwipeDivDivChildren[i - 1].style.opacity = 1;
            }, 10);
            setTimeout(function() {
               cardSwipeDivDivChildren[i].style.pointerEvents = "auto";
               cardSwipeDivDivChildren[i - 1].style.pointerEvents = "auto";
               // Enable the Prev Slide Button
               document.getElementById("cardBackButton").disabled = false;
               document.getElementById("cardNextButton").disabled = false;
            }, 510);

            cardCurrent = cardSwipeDivDivChildren[i - 1];
            cardCurrentIndex--;
            break;
         }
      }
   }
   setCardIndicator();
}

function ifDblClicked(clickedParent) {
   while (clickedParent && clickedParent.className !== "cardSwipeDivDiv") {
      clickedParent = clickedParent.parentElement;
   }
   let cardSwipeDivDivChildren = clickedParent.children;

   // Loop (-1 to prevent last)
   for (i = 0; i < cardSwipeDivDivChildren.length - 1; i++) {
      if (cardSwipeDivDivChildren[i].style.display === "flex") {
         document.getElementById("cardBackButton").disabled = true;
         document.getElementById("cardNextButton").disabled = true;
         cardSwipeDivDivChildren[i].style.pointerEvents = "none";
         cardSwipeDivDivChildren[i + 1].style.pointerEvents = "none";
         cardSwipeDivDivChildren[i].style.left = "-50px";
         cardSwipeDivDivChildren[i].style.opacity = 0;
         setTimeout(function() {
            cardSwipeDivDivChildren[i].style.pointerEvents = "auto";
            cardSwipeDivDivChildren[i + 1].style.pointerEvents = "auto";
            cardSwipeDivDivChildren[i].style.display = "none";
            document.getElementById("cardBackButton").disabled = false;
            document.getElementById("cardNextButton").disabled = false;
         }, 500);
         cardCurrent = cardSwipeDivDivChildren[i + 1];
         cardCurrentIndex++;
         break;
      }
   }
   setCardIndicator();
}

// Number list function
function getNumberListIndex() {
   numberListIndex = document.getElementsByClassName("fancyNumbers").length + 1;
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
