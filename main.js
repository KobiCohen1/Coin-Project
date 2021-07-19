let selectedCoinsArray = [];

(function () {
    $(function () {
        $.get("https://api.coingecko.com/api/v3/coins").then(
            function (coins) {
                coinsArray = coins;
                showAllCoins(coins);
            })
            .catch((e) => {
                console.log(e);
                alert("An error has been found: " + e);
            });
        })
})();

// Shows all fetched coins.
function showAllCoins(coins) {
    for (let index = 0; index < coins.length; index++) {
        showCoinInUI(coins[index]);
        moreInfoBTNToggle(coins[index].id);
    }
}

// Shows fetched coins inside a container.
function showCoinInUI(coins) {
    $(".loader").hide();
    let coinHTML =
    `
    <div id="${coins.id}" class="coinCard ${coins.symbol}">
    <input id="checked${coins.id}" class="${coins.symbol} checkBox" name="check" onclick="selectedCoinCheckToggle('${coins.symbol}');saveToLocalStorage()" type="checkbox">
    
    <h5 class="coinSymbol">${coins.symbol}</h5>
    <h5 class="coinName">${coins.name}</h5>
    
    <div id="moreInfoDiv${coins.id}">
    </div>
    
    <input type="button" id="moreInfoBTN${coins.id}" data-toggle="collapse" data-target="#moreInfoDiv${coins.id}" class="moreInfoBTN" value="More Info">
    </div>
    `;
    
    $(".container").append(coinHTML);
}

// More info section.
function moreInfoBTNToggle(coinId) {
    $(`#moreInfoBTN${coinId}`).click(function () {
        $(`#moreInfoDiv${coinId}`).html(`<div id="moreInfoLoaderwrapper"><div id="moreInfoLoader" class="spinner-border text-dark" role="status"></div></div>`)
        $.get(`https://api.coingecko.com/api/v3/coins/${coinId}`).then(function (coin) {
            $(`#moreInfoDiv${coinId}`).html(
                `
            <div class="coinInfoDiv">
            <div class="coinImage"> <img src="${coin.image.thumb}" width="30px"></div>
            <h5><i class="fa">&#xf155;</i>: ${coin.market_data.current_price.usd}</h5>
            <h5><i class="fa">&#xf20b;</i>: ${coin.market_data.current_price.ils}</h5>
            <h5><i class="fa">&#xf153;</i>: ${coin.market_data.current_price.eur}</h5>
            </div>
            `
            )
        }).catch((e) => {
            console.log(e);
            alert("An error has been found: " + e);
        })
    })
}


// Adds selected coin to an array,
// will open a modal if user checked more than five coins.
function selectedCoinCheckToggle(coinName) {
    let coinIndex = selectedCoinsArray.indexOf(coinName);
    let lastToggledCheckbox = coinName;

        if(coinIndex != -1) {
            selectedCoinsArray.splice(coinIndex, 1);
        }
        else{ 
            if(selectedCoinsArray.length < 5) {
                selectedCoinsArray.push(coinName);
            }
            else {
                selectedCoinsArray.push(lastToggledCheckbox);
                showSelectedCoinsInModal(lastToggledCheckbox);
                openModal();
            }
        }
        
    }
    
// Shows selected coins in modal (if the user chose more than five coins).
function showSelectedCoinsInModal(lastToggledCheckbox){
    let selectedCoins = "";
    
    for (index = 0; index < selectedCoinsArray.length; index++) {
        selectedCoins +=
        `
        <div class="selectedCoins">
        <input type="checkbox" id="${selectedCoinsArray[index]}" class="selectedCoincheckBox" onclick="modalCoinUncheked(this, ${lastToggledCheckbox});saveToLocalStorage()" checked>
            <span>${selectedCoinsArray[index].toUpperCase()}</span>
            </div>
        
        `;
    }
    $(".selctedCoinsContainer").html(selectedCoins);
}

// If user uncheked a card inside the modal.
function modalCoinUncheked(coinName){
    let uncheckedCoin = coinName.id;
    if(coinName.checked == false){
        // Removes coin from array.
        var index = selectedCoinsArray.indexOf(uncheckedCoin);
        if (index !== -1) {
            selectedCoinsArray.splice(index, 1);
        }
        selectedCoinsArray.length = 5;
        $("#modalContainer").removeClass("show");
        $( `.${uncheckedCoin}` ).prop( "checked", false );

    }
}

// ClosesModal
function onClickCloseMaxLimitReachedModal() {

    let removeLast = selectedCoinsArray.slice(-1);
    $( `.${removeLast}` ).prop( "checked", false );

    selectedCoinsArray.splice(-1);

    $("#modalContainer").removeClass("show");
}

// Live Search.
$("#searchInput").on("keyup", function () {
    let value = $("#searchInput").val().toUpperCase();

    $(".coinCard").each(function () {
        let card = $(this).attr("id").toUpperCase();
        let symbol = $(this).attr("class").split(' ')[1].toUpperCase();

        if (card.includes(value) || symbol.includes(value)) {
            $(this).show()
        }
        else {
            $(this).hide()
        }
    })
})

// Prevents the user from writing nonsense in the search input.
$('#searchInput').on('keypress', function (e) {
    let key = String.fromCharCode(!e.charCode ? e.which : e.charCode);
    if (!/^[A-Z0-9]+$/i.test(key)) {
        e.preventDefault();
    }
})

// Clears search input on click.
function onClickClearSearchInput(){
    $("#searchInput").val("")
    $(".coinCard").show()
}

// Unchecks all toggles.
function onClickUncheckAllToggles(){
    $(".checkBox").prop("checked", false);
    selectedCoinsArray = [];
}

// Closes modal.
function onClickCloseSelectACoinModal() {
    $("#selectACoinModalContainer").removeClass("show");
}

// When user clicks on home.
function onClickShowHome () {
    $("#searchInput").val("")
    $(".coinCard").show()
    clearInterval(interval);
    $("#chartContainer").hide()
    $(".aboutMe").attr("hidden", true)
    $(".liveReportsDiv").attr("hidden", true)
    $(".earnInvest").fadeIn(130);
    $(".loader").hide();
    $(".searchForACoinDiv").fadeIn(130);
    $(".container").fadeIn(130);
}

// When user clicks on About Me.
function onClickShowAboutPage() {
    clearInterval(interval);
    $(".searchForACoinDiv").hide()
    $("#chartContainer").hide();
    $(".container").hide();
    $(".loader").hide();
    $(".earnInvest").hide();
    $(".aboutMe").attr("hidden", false);
    $(".aboutMe").hide().fadeIn();
}

// Opens the modal.
function openModal(){
    $(".modalContainer").addClass("show");
}

// Stops the animation when user clicks on "Live Reports". (Adds this function to the local storage).
function stopAnimation(){
    $(".liveReports").removeClass()
}

// When user clicks on Live Reports.
function onClickShowLiveReports(){
    stopAnimation()
    $("#chartContainer").css("display", "none");
    $("#chartContainer").hide()
    if(!selectedCoinsArray.length) {
        // Shows a modal and removes the x button from the modal.
        $(".selectACoinModalContainer").addClass("show");
        $("#closeSelectACoinModal").attr("hidden", true)
    } else {
        $(".aboutMe").attr("hidden", true)
        $(".loader").show()
        $(".searchForACoinDiv").hide()
        $(".container").hide()
        showLiveReports()
    }
}


let interval;
function showLiveReports(){

    $(".loader").show();
    $("#chartContainer").empty()
    clearInterval(interval)
    interval = setInterval(() => {
        showCoinsOnGraph();
    },2000);
        selctedCoin1 = [];
        selctedCoin2 = [];
        selctedCoin3 = [];
        selctedCoin4 = [];
        selctedCoin5 = [];
        coinsKeysArr = [];
}

function showCoinsOnGraph() {
    let url = `https://min-api.cryptocompare.com/data/pricemulti?fsyms=${selectedCoinsArray[0]},${selectedCoinsArray[1]},${selectedCoinsArray[2]},${selectedCoinsArray[3]},${selectedCoinsArray[4]}&tsyms=USD`

    $.get(url).then((coinData) => {
        $("#chartContainer").fadeIn(200)
        $(".loader").fadeOut(200)

        let currentDate = new Date();
        let counter = 1;

        for (let key in coinData) {
            if (counter == 1) {
                selctedCoin1.push({ x: currentDate, y: coinData[key].USD });
                coinsKeysArr.push(key);
            }

            if (counter == 2) {
                selctedCoin2.push({ x: currentDate, y: coinData[key].USD });
                coinsKeysArr.push(key);
            }

            if (counter == 3) {
                selctedCoin3.push({ x: currentDate, y: coinData[key].USD });
                coinsKeysArr.push(key);
            }

            if (counter == 4) {
                selctedCoin4.push({ x: currentDate, y: coinData[key].USD });
                coinsKeysArr.push(key);
            }

            if (counter == 5) {
                selctedCoin5.push({ x: currentDate, y: coinData[key].USD });
                coinsKeysArr.push(key);
            }
            
            counter++;
            
            var chart = new CanvasJS.Chart("chartContainer", {
                exportEnabled: true,
                theme: "dark2",
                title:{
                    text: "Live coin value.",
                    fontSize: 18
                },
                axisX:{
                    valueFormatString: "HH:mm:ss",
                },
                axisY: {
                    title: "Currencies Value",
                    suffix: "$",
                    titleFontColor: "white",
                    lineColor: "white",
                    labelFontColor: "white",
                    tickColor: "white",
                    includeZero: false,
                  },
            
                legend:{
                    verticalAlign: "top",
                    fontSize: 16,
                },
                toolTip: {
                    shared:false
                },
                data: [
                    {
                    type: "spline",
                    name: coinsKeysArr[0],
                    showInLegend: true,
                    xValueFormatString: "HH:mm:ss",
                    dataPoints: selctedCoin1,
                  },
                  {
                    type: "spline",
                    name: coinsKeysArr[1],
                    showInLegend: true,
                    xValueFormatString: "HH:mm:ss",
                    dataPoints: selctedCoin2,
                  },
                  {
                    type: "spline",
                    name: coinsKeysArr[2],
                    showInLegend: true,
                    xValueFormatString: "HH:mm:ss",
                    dataPoints: selctedCoin3,
                  },
                  {
                    type: "spline",
                    name: coinsKeysArr[3],
                    showInLegend: true,
                    xValueFormatString: "HH:mm:ss",
                    dataPoints: selctedCoin4,
                  },
                  {
                    type: "spline",
                    name: coinsKeysArr[4],
                    showInLegend: true,
                    xValueFormatString: "HH:mm:ss",
                    dataPoints: selctedCoin5,
                  }]
            });
        chart.render();
        }
    })
}
    
// Shows back to top arrow (when scrolling down).
toTop();
function toTop(){
    window.addEventListener("scroll", () => {
        const backToTop = document.querySelector(".backToTop")
        if(window.pageYOffset > 40) {
            backToTop.classList.add("active")
        } else {
            backToTop.classList.remove("active")
        }
    });       
}

// When user clicks on Live Reports, it will stop glowing.
function onFirstClickStopGlowing(){
    localStorage.setItem('LiveReportsHasBeenClicked', "clicked");
}

// Saves the checked coin to local storage.
function saveToLocalStorage(){
    localStorage.setItem('checkedButtonsKey', JSON.stringify(selectedCoinsArray));
}

// Loads local storage.
loadLocalStorage();
function loadLocalStorage(){
    
    setInterval(function(){

        // When user clicks on the "Live Reports" for the first time, it will stop glowing.
        let liveReportsHasBeenClicked = localStorage.getItem('LiveReportsHasBeenClicked');
        if(!liveReportsHasBeenClicked) {
            return;
        }
        stopAnimation();
        

        let selectedCoins = JSON.parse(localStorage.getItem("checkedButtonsKey"));
        
        if(!selectedCoins) {
            return;
        }
        
        for(let index = 0; index < selectedCoins.length; index++) {
            if(  $(`.${selectedCoins[index]}`).prop("checked", true)) {
                selectedCoinsArray = selectedCoins;
            }
        }
    }, 120);   
}

// Expands a hidden div on "about me" page when clicking on "about this project" button.
$("#showMoreButton").on('click', function(){
    $(".infoAboutProject").slideToggle()
})