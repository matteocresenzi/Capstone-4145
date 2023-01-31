
$(document).ready(function(){
    //intitial setup of map
    mapRefresh();

    $("#type").selectmenu();
    $("#time2, #time1, #compare1, #compare2" ).selectmenu();
    //fillinf the select options from compare selects
    fillCompareSelect();
    //on date time selection refresh the entire map

    //color button funcitonality
    document.getElementById("dateTime").onchange = mapRefresh;
    $("#gradientButton").click(function(){
        changeGradient();
    });

    //Size Button Functionality
    $("#sizeButton").click(function(){
        changeSize();
    });
    //opacity button funcitonality
    $("#opacityButton").click(function(){
        changeOpacity();
    });
    //Time Button Functionality
    $("#timeButton").click(function(){
        timeButtonStateChange();
        mapRefresh();

    });
    let colorKey = document.getElementById("colorKey");
    let gradientButton = document.getElementById("gradientButton");

    

    gradientButton.addEventListener("click", changePic);

    //hiding menu divs
    $(".infoDiv").hide();
    $("#reccommendDiv").hide();
    $("#compareDiv").hide();
    $("#customInfoDiv").hide();
    $("#customMenuContainer").hide();
    
    //options menu functionality
    $("#optionsMenuButton").click(function(){
      
        $("#customMenuContainer").show();
    });
    $("#menuExitButton").click(function(){
      
        $("#customMenuContainer").hide();
    });
    //end of options menu functionality

    //Menu option 1 - Building info chart
    $("#buildingInfoClick").click(function(){
        $("#customMenuContainer").hide();
        $(".customInfoDiv").show();
        fillList();
    });

    //Menu option 2 - Restaurant info chart
    $("#restaurantClick").click(function(){
        $("#customMenuContainer").hide();
        $("#customInfoDiv").show();
        fillRestaurantList();      
    });

    //Menu option 3 - Recommmender 
    $("#recommenderClick").click(function(){
        $("#customMenuContainer").hide();
        $("#reccommendDiv").show();
    });
    $("#recommenderExitButton").click(function(){
        $("#reccommendDiv").hide();
        $("#recommendationResult").html("");
        
        
    });

    //compare option functionality
    $("#compareClick").click(function(){
        $("#customMenuContainer").hide();
        $("#compareDiv").show();
       
    });

    $("#exitButtonCompare").click(function(){
        $("#compareDiv").hide();
    });

    //on options button click, hide any divs that may be open
    $("#menuButton").click(function(){
        $("#compareDiv").hide();
        $("#reccommendDiv").hide();
        $("#recommendationResult").html("");
    });
    
    //on user select option change for campare menu, refresh information shown
    $("#compare1, #compare2").on("selectmenuchange", addBuildingInfo);
    document.getElementById("building2DateTime", "building1DateTime").onchange = addBuildingInfo;
    document.getElementById( "building1DateTime").onchange = addBuildingInfo;
    //function generates recommendation on click
    $("#recommendatioButton").click(function(){
        generateReccomendation();
    });
    
});

function changePic() {

    if (colorKey.getAttribute('src') === "legend.jpg"){
        colorKey.setAttribute('src', "legend2.jpg");
    }
    else {
        colorKey.setAttribute('src', "legend.jpg");
    }
}

const UNCC_BOUNDS = {
    north: 35.315700,
    south: 35.299345,
    west: -80.746187,
    east: -80.724543,
};

var styles = [
        {
            "featureType": "poi",
            "stylers": [
                { "visibility": "off" }
            ]
        },{
            "featureType": "poi",
            "stylers": [
                { "visibility": "off" }
            ]
        },{
            "featureType": "transit",
            "stylers": [
                { "visibility": "off" }
            ]
        }
    ]
;

//Restaurant hash table

let restaurantHashTable = {
    CHICKFILA: {BUILDING: "PROSPECTOR", NAME: "Chick-Fil-A"},
    WENDYS: {BUILDING: "STUDENTUNION", NAME: "Wendy's"},
    Bojangles: {BUILDING: "STUDENTUNION", NAME: "Bojangles"},
    CROWNS: {BUILDING: "STUDENTUNION", NAME: "Crowns Commons"},
    STARBUCKS: {BUILDING: "STUDENTUNION", NAME: "Starbucks"},
    SALSARITAS: {BUILDING: "PROSPECTOR", NAME: "Salsarita's"},
    MAMMA: {BUILDING: "PROSPECTOR", NAME: "Mamma Leone's"},
    Sushi: {BUILDING: "PROSPECTOR", NAME: "Sushi with Gusto"},
    BURGER: {BUILDING: "PROSPECTOR", NAME: "Burger 704"},
    SOVI: {BUILDING: "SOVI", NAME: "SoVi"},
    PANDA: {BUILDING: "CONE", NAME: "Panda Express"},
    SUBWAY: {BUILDING: "CONE", NAME: "Subway"},


}

//Object Hash Table of buildings to their abbreviation to use in code and prevent confusion, buildings in all caps

let buildingHashTable = {
    UREC: "UREC",
    ATKINS: "Atki",
    BELKGYM: "BelG",
    STUDENTUNION: "StuU",
    BURSON: "Burs",
    CAMERON: "Came",
    DENNY: "Denn",
    COLVARD: "Colv",
    DUKE: "Duke",
    EPIC: "EPIC",
    PROSPECTOR: "Pros",
    WOODWARD: "Wood",
    BIOINFORMATICS: "Bioi",
    COED: "CoEd",
    CONE: "Cone",
    FRETWELL: "Fret",
    PORTAL: "PORT",
    GRIGG: "Grig",
    SOVI: "SVDH",
    //CATO: "Cato",
    CHHS: "Heal",
    KING: "King",
    KENNEDY: "Kenn",
    ROWE: "Rowe",
    MCENIRY: "McEn",
    FRIDAY: "Frid",
    BARNARD: "Barn",
    MACY: "Macy",
    GARINGER: "Gari",
    WINNINGHAM: "Winn",
    ROBINSON: "Robi",
    STORRS: "Stor"
    
//CATO is placing markers in wrong area, just keep CoEd
    
}
//building hashtable 2 contains uncapitalized names of buildings to use in charts and such
let buildingHashTable2 = {
    UREC: {ABBREVIATION:"UREC", NAME: "UREC"},
    ATKINS:{ABBREVIATION:"Atki", NAME: "Atkins Library"} ,
    BELKGYM: {ABBREVIATION:"BelG", NAME: "Belk Gym"},
    STUDENTUNION: {ABBREVIATION:"StuU", NAME: "Student Union"},
    BURSON: {ABBREVIATION:"Burs", NAME: "Burson"},
    CAMERON: {ABBREVIATION:"Came", NAME: "Cameron"},
    DENNY: {ABBREVIATION:"Denn", NAME: "Denny"} ,
    COLVARD: {ABBREVIATION:"Colv", NAME: "Colvard"},
    DUKE: {ABBREVIATION:"Duke", NAME: "Duke"},
    EPIC: {ABBREVIATION:"EPIC", NAME: "Epic"},
    PROSPECTOR: {ABBREVIATION:"Pros", NAME: "Prospector"},
    WOODWARD:{ABBREVIATION:"Wood", NAME: "Woodward"} ,
    BIOINFORMATICS: {ABBREVIATION:"Bioi", NAME: "BioInformatics"},
    COED: {ABBREVIATION:"CoEd", NAME: "College of Education"},
    CONE: {ABBREVIATION:"Cone", NAME: "Cone"},
    FRETWELL: {ABBREVIATION:"Fret", NAME: "Fretwell"},
    PORTAL: {ABBREVIATION:"PORT", NAME: "Portal"},
    GRIGG: {ABBREVIATION:"Grig", NAME: "Grigg"},
    SOVI: {ABBREVIATION:"SVDH", NAME: "Sovi"},
    CHHS: {ABBREVIATION:"Heal", NAME: "College of Health Services"},
    KING: {ABBREVIATION:"King", NAME: "King"},
    KENNEDY: {ABBREVIATION:"Kenn", NAME: "Kennedy"},
    ROWE: {ABBREVIATION:"Rowe", NAME: "Rowe"},
    MCENIRY: {ABBREVIATION:"McEn", NAME: "McEniry"},
    FRIDAY: {ABBREVIATION:"Frid", NAME: "Friday"},
    BARNARD: {ABBREVIATION:"Barn", NAME: "Barnard"},
    MACY: {ABBREVIATION:"Macy", NAME: "Macy"},
    GARINGER: {ABBREVIATION:"Gari", NAME: "Garinger"},
    WINNINGHAM: {ABBREVIATION:"Winn", NAME: "Winningham"},
    ROBINSON: {ABBREVIATION:"Robi", NAME: "Robinson"},
    STORRS: {ABBREVIATION:"Stor", NAME: "Storrs"}
    
//CATO is placing markers in wrong area, just keep CoEd
    
}


//these are the variables that will be modified as the user selects time and date
var currentFilePath;
var currentHour;
var myList = [];
var heatMapPoints = [];
let temp;
let tempString;

//Below are the cordiantes for each building as well as the building weight map that will be filled by using info from the JSON file
var cordinateMapX = new Map();
var cordinateMapY = new Map();
var buildingWeight = new Map();

cordinateMapX.set(buildingHashTable.UREC, 35.30828240051414);
cordinateMapY.set(buildingHashTable.UREC, -80.7354048026442);
cordinateMapX.set(buildingHashTable.ATKINS, 35.30580227045677);
cordinateMapY.set(buildingHashTable.ATKINS, -80.7321921708205);
cordinateMapX.set(buildingHashTable.BELKGYM, 35.30539285658393);
cordinateMapY.set(buildingHashTable.BELKGYM, -80.73556587697733);
cordinateMapX.set(buildingHashTable.STUDENTUNION, 35.308733600648736);
cordinateMapY.set(buildingHashTable.STUDENTUNION, -80.73375791517492);
cordinateMapX.set(buildingHashTable.BURSON, 35.30755202779894);
cordinateMapY.set(buildingHashTable.BURSON, -80.73245238202595);
cordinateMapX.set(buildingHashTable.CAMERON, 35.30766340578566);
cordinateMapY.set(buildingHashTable.CAMERON, -80.73120876534848);
cordinateMapX.set(buildingHashTable.DENNY, 35.30540989667834);
cordinateMapY.set(buildingHashTable.DENNY, -80.72980119011649);
cordinateMapX.set(buildingHashTable.COLVARD, 35.30485735361828);
cordinateMapY.set(buildingHashTable.COLVARD, -80.73171867761586);
cordinateMapX.set(buildingHashTable.DUKE, 35.311968214346244);
cordinateMapY.set(buildingHashTable.DUKE, -80.74124823312059);
cordinateMapX.set(buildingHashTable.EPIC, 35.309087539725724);
cordinateMapY.set(buildingHashTable.EPIC, -80.74159117551818);
cordinateMapX.set(buildingHashTable.PROSPECTOR, 35.306814202649974);
cordinateMapY.set(buildingHashTable.PROSPECTOR, -80.73087887288469);
cordinateMapX.set(buildingHashTable.WOODWARD, 35.30744822877269);
cordinateMapY.set(buildingHashTable.WOODWARD, -80.73566633711343);
cordinateMapX.set(buildingHashTable.BIOINFORMATICS, 35.312679527276934);
cordinateMapY.set(buildingHashTable.BIOINFORMATICS, -80.74201738001688);
cordinateMapX.set(buildingHashTable.COED, 35.307575);
cordinateMapY.set(buildingHashTable.COED, -80.734177);
cordinateMapX.set(buildingHashTable.CONE, 35.305156834601746);
cordinateMapY.set(buildingHashTable.CONE, -80.73324174007793);
cordinateMapX.set(buildingHashTable.FRETWELL, 35.306051269157344);
cordinateMapY.set(buildingHashTable.FRETWELL, -80.72902588357599);
cordinateMapX.set(buildingHashTable.PORTAL, 35.31169521548943);
cordinateMapY.set(buildingHashTable.PORTAL, -80.74298844343465);
cordinateMapX.set(buildingHashTable.GRIGG, 35.31132178048417);
cordinateMapY.set(buildingHashTable.GRIGG, -80.74191988409817);
cordinateMapX.set(buildingHashTable.SOVI, 35.302913717430094);
cordinateMapY.set(buildingHashTable.SOVI, -80.73485709439822);
//cordinateMapX.set(buildingHashTable.CATO, 35.30774517751554);
//cordinateMapY.set(buildingHashTable.CATO, -80.73374779362989);
cordinateMapX.set(buildingHashTable.CHHS, 35.30749472169555);
cordinateMapY.set(buildingHashTable.CHHS, -80.7333877703301);
cordinateMapX.set(buildingHashTable.KING, 35.30508074951166);
cordinateMapY.set(buildingHashTable.KING, -80.7325550772337);
cordinateMapX.set(buildingHashTable.KENNEDY, 35.30598284294199);
cordinateMapY.set(buildingHashTable.KENNEDY, -80.73092114732545);
cordinateMapX.set(buildingHashTable.ROWE, 35.30453814104648);
cordinateMapY.set(buildingHashTable.ROWE, -80.73072976519171);
cordinateMapX.set(buildingHashTable.MCENIRY, 35.307211693836535);
cordinateMapY.set(buildingHashTable.MCENIRY, -80.73019154498584);
cordinateMapX.set(buildingHashTable.FRIDAY, 35.30631631915391);
cordinateMapY.set(buildingHashTable.FRIDAY, -80.72995964401406);
cordinateMapX.set(buildingHashTable.BARNARD, 35.3057945900544);
cordinateMapY.set(buildingHashTable.BARNARD, -80.72992298495707);
cordinateMapX.set(buildingHashTable.MACY, 35.305704398948556);
cordinateMapY.set(buildingHashTable.MACY, -80.73038760971932);
cordinateMapX.set(buildingHashTable.GARINGER, 35.30499575103916);
cordinateMapY.set(buildingHashTable.GARINGER, -80.73002448065607);
cordinateMapX.set(buildingHashTable.WINNINGHAM, 35.305143003062035);
cordinateMapY.set(buildingHashTable.WINNINGHAM, -80.73039212063783);
cordinateMapX.set(buildingHashTable.ROBINSON, 35.30386202639);
cordinateMapY.set(buildingHashTable.ROBINSON, -80.72993444303359);
cordinateMapX.set(buildingHashTable.STORRS, 35.304615566608916);
cordinateMapY.set(buildingHashTable.STORRS, -80.72915670025833);



//These are coordinates for each building's shape to allow them to be clicked on map
//
//
//
//

//These coords are used with the Google maps API to create shape objects for each building
const urecShapeCoords = [
    { lat: 35.308432253929754, lng: -80.73583374185519 }, // Top left
    { lat: 35.308432253929754, lng: -80.73493706987938 }, // Top right
    { lat: 35.30812777607675, lng: -80.73493706987938 },  // bottom right
    { lat: 35.30812777607675, lng: -80.73583374185519 },  // bottom left
];

const atkinsShapeCoords = [
    { lat: 35.30618211129387, lng: -80.73280745886328 },
    { lat: 35.30618211129387, lng: -80.73136252382474  },
    { lat: 35.30552354030355, lng: -80.73136252382474  },
    { lat: 35.30552354030355, lng: -80.73280745886328  },
];

const belkShapeCoords = [
    { lat: 35.305757830327266, lng: -80.73618281887289  },
    { lat: 35.305757830327266, lng: -80.73524941012587  },
    { lat: 35.30500484667147, lng: -80.73524941012587 },
    { lat: 35.30500484667147, lng: -80.73618281887289  },
];

const studentUnionShapeCoords = [
    { lat: 35.30897860059564, lng: -80.73433170767746 },
    { lat: 35.30897860059564, lng: -80.73313007802611 },
    { lat: 35.30824534637546, lng: -80.73313007802611 },
    { lat: 35.30824534637546, lng: -80.73433170767746 },
];


const bursonShapeCoords = [
    { lat: 35.307725246058936, lng: -80.73299694332529 },
    { lat: 35.307725246058936, lng: -80.73193863599927 },
    { lat: 35.30715876925303, lng: -80.73193863599927 },
    { lat: 35.30715876925303, lng: -80.73299694332529 },
];

const cameronShapeCoords = [
    { lat: 35.30792539758837, lng: -80.73160055194114 },
    { lat: 35.30792539758837, lng: -80.73080663007038 },
    { lat: 35.30742475683544, lng: -80.73080663007038 },
    { lat: 35.30742475683544, lng: -80.73160055194114 },
];


const dennyShapeCoords = [
    { lat: 35.30560645621952, lng: -80.73000665648031 },
    { lat: 35.30560645621952, lng: -80.72960432514333 },
    { lat: 35.30520150872728, lng: -80.72960432514333 },
    { lat: 35.30520150872728, lng: -80.73000665648031 },
];

const colvardShapeCoords = [
    { lat: 35.305324353567585, lng: -80.73211371585455 },
    { lat: 35.305324353567585, lng: -80.73135317600199 },
    { lat: 35.30446377700056, lng: -80.73135317600199 },
    { lat: 35.30446377700056, lng: -80.73211371585455 },
];


const dukeShapeCoords = [
    { lat: 35.31185079902643, lng: -80.74166349621309 },
    { lat: 35.31230271637708, lng: -80.7411855509927 },
    { lat: 35.31199937487237, lng: -80.74076450401283 },
    { lat: 35.31154436048228, lng: -80.74127658817754 },
];


const epicShapeCoords = [
    { lat: 35.30946933393975, lng: -80.74190469955056 },
    { lat: 35.308948185921594, lng: -80.74105603408181 },
    { lat: 35.30837909345747, lng: -80.7416139335082 },
    { lat: 35.30895256354042, lng: -80.74239713847221 },
];

const prospectorShapeCoords = [
    { lat: 35.307169294042225, lng: -80.7310926569935 },
    { lat: 35.307169294042225, lng: -80.73064204589608 },
    { lat: 35.30642507903455, lng: -80.73064204589608 },
    { lat: 35.30642507903455, lng: -80.7310926569935 },
];

const woodwardShapeCoords = [
    { lat: 35.307638378598995, lng: -80.73593745332892 },
    { lat: 35.307638378598995, lng: -80.7348816619922 },
    { lat: 35.30687049292217, lng: -80.7348816619922 },
    { lat: 35.30687049292217, lng: -80.73593745332892 },
];

const bioinformaticsShapeCoords = [
    { lat: 35.31259986613882, lng: -80.74237662081882 },
    { lat: 35.312980587671824, lng: -80.74197074670307 },
    { lat: 35.31275772650414, lng: -80.74164453012406 },
    { lat: 35.312370813296226, lng: -80.74204661102377 },
];

const coedShapeCoords = [
    { lat: 35.30786658360647, lng: -80.73438985605516 },
    { lat: 35.30786658360647, lng: -80.73385398613198 },
    { lat: 35.30730433741148, lng: -80.73385398613198 },
    { lat: 35.30730433741148, lng: -80.73438985605516 },
];

const coneShapeCoords = [
    { lat: 35.30558303194232, lng: -80.73346404756457 },
    { lat: 35.30558303194232, lng: -80.7328618397819 },
    { lat: 35.305161524604905, lng: -80.7328618397819 },
    { lat: 35.305161524604905, lng: -80.73346404756457 },
];

const fretwellShapeCoords = [
    { lat: 35.306475660540876, lng: -80.72942549285187 },
    { lat: 35.306475660540876, lng: -80.72848940194115 },
    { lat: 35.305878095085305, lng: -80.72848940194115 },
    { lat: 35.305878095085305, lng: -80.72942549285187 },
];

const portalShapeCoords = [
    { lat: 35.31156826495034, lng: -80.74335468279756 },
    { lat: 35.31195088497801, lng: -80.74294321126975 },
    { lat: 35.311734848041986, lng: -80.74263699990021 },
    { lat: 35.31134962412194, lng: -80.74305166112978 },
];

const griggShapeCoords = [
    { lat: 35.311050112595495, lng: -80.74260724704928 },
    { lat: 35.3115639413222, lng: -80.74202688499592 },
    { lat: 35.31122654812866, lng: -80.74155652620759 },
    { lat: 35.310759147893165, lng: -80.74206102394024 },
];

const soviShapeCoords = [
    { lat: 35.303116121374366, lng: -80.7352806542296 },
    { lat: 35.303116121374366, lng: -80.7344920848091 },
    { lat: 35.30252290907234, lng: -80.7344920848091 },
    { lat: 35.30252290907234, lng: -80.7352806542296 },
];

const chhsShapeCoords = [
    { lat: 35.30794506216922, lng: -80.73356631204373 },
    { lat: 35.30794506216922, lng: -80.73308887885717 },
    { lat: 35.30690098036771, lng: -80.73308887885717},
    { lat: 35.30690098036771, lng: -80.73356631204373 },
];

const kingShapeCoords = [
    { lat: 35.30523616004091, lng: -80.7327393567272 },
    { lat: 35.30523616004091, lng: -80.7323584830615 },
    { lat: 35.304920956400714, lng: -80.7323584830615 },
    { lat: 35.304920956400714, lng: -80.7327393567272 },
];

const kennedyShapeCoords = [
    { lat: 35.3061456766128, lng: -80.73113477348694 },
    { lat: 35.3061456766128, lng: -80.73072427977252 },
    { lat: 35.30578491315174, lng: -80.73072427977252 },
    { lat: 35.30578491315174, lng: -80.73113477348694 },
];

const roweShapeCoords = [
    { lat: 35.30477657614483, lng: -80.73108277263134 },
    { lat: 35.30477657614483, lng: -80.7303407263014 },
    { lat: 35.30416915707214, lng: -80.7303407263014},
    { lat: 35.30416915707214, lng: -80.73108277263134 },
];

const mceniryShapeCoords = [
    { lat: 35.307418526560305, lng: -80.73054738107295 },
    { lat: 35.307418526560305, lng: -80.72985805334885 },
    { lat: 35.30679470166045, lng: -80.72985805334885 },
    { lat: 35.30679470166045, lng: -80.73054738107295 },
];

const fridayShapeCoords = [
    { lat: 35.306603352740915, lng: -80.73023607195744 },
    { lat: 35.306603352740915, lng: -80.72967280805837 },
    { lat: 35.30602548822784, lng: -80.72967280805837 },
    { lat: 35.30602548822784, lng: -80.73023607195744 },
];

const barnardShapeCoords = [
    { lat: 35.30588644334289, lng: -80.730222601387 },
    { lat: 35.30588644334289, lng: -80.72979613014914 },
    { lat: 35.30570695397434, lng: -80.72979613014914 },
    { lat: 35.30570695397434, lng: -80.730222601387 },
];

const macyShapeCoords = [
    { lat: 35.305887633050645, lng: -80.73050166127365 },
    { lat: 35.305887633050645, lng: -80.73028306123662 },
    { lat: 35.30547502580406, lng: -80.73028306123662 },
    { lat: 35.30547502580406, lng: -80.73050166127365 },
];

const garingerShapeCoords = [
    { lat: 35.30507750157947, lng: -80.73021731517473 },
    { lat: 35.30507750157947, lng: -80.72980195797827 },
    { lat: 35.30490260043431, lng: -80.72980195797827 },
    { lat: 35.30490260043431, lng: -80.73021731517473 },
];

const winninghamShapeCoords = [
    { lat: 35.30531895740637, lng: -80.73050180640517 },
    { lat: 35.30531895740637, lng: -80.73028559307004 },
    { lat: 35.304907243832446, lng: -80.73028559307004 },
    { lat: 35.304907243832446, lng: -80.73050180640517 },
];

const robinsonShapeCoords = [
    { lat: 35.30422131074929, lng: -80.73023239630423 },
    { lat: 35.30422131074929, lng: -80.7295799630824 },
    { lat: 35.30337620073741, lng: -80.7295799630824 },
    { lat: 35.30337620073741, lng: -80.73023239630423 },
];

const storrsShapeCoords = [
    { lat: 35.305026235371244, lng: -80.7294864506802 },
    { lat: 35.305026235371244, lng: -80.72877834749279 },
    { lat: 35.30414190864265, lng: -80.72877834749279 },
    { lat: 35.30414190864265, lng: -80.7294864506802 },
];

//
//
//
// End of coordinates






//function parses through the json for the day and then fills out the building weight map
async function getData(jsonFile, hour){

//fetching json file and parsing information to  myList, testvar is basically the foot traffic for the hour passed 
let re = await fetch(jsonFile);
let tempJson = await re.json();
for(let iso of tempJson){
    //console.log(iso);
    tempString =  JSON.stringify(iso);
    temp =  JSON.parse(tempString);
    await myList.push(iso);

}
//Accessing the right hour is easy, the way the json is made, jsut use list[hour] in 0-23 format to get the hour desired
let testvar = await myList[hour];



//loop through each builing in building table and set the weights

for (var prop in buildingHashTable){
  
    buildingWeight.set(buildingHashTable[prop], testvar[buildingHashTable[prop]]);
    
}



}


//map init
let heatmap;
function initMap() {
   
   

  

    //adding the locations to the heatmap points based on the buildings in the building hash table
    for (var prop in buildingHashTable){
        heatMapPoints.push({location:  new  google.maps.LatLng(cordinateMapX.get(buildingHashTable[prop]), cordinateMapY.get(buildingHashTable[prop])), weight: buildingWeight.get(buildingHashTable[prop])},)
        
    }


    //using an for loop, run through every item in building weight and add a heatmappoint 

    // The location of uncc
    const uncc = { lat: 35.3071, lng: -80.7352 };
    const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 17,
        minZoom: 17 - 0.8,
        
        center: uncc,
        disableDefaultUI: true,
        restriction: {
            latLngBounds: UNCC_BOUNDS,
            strictBounds: false,
        },
        zoomControl: true,
        styles: styles,


    });

    /*var*/ heatmap = new google.maps.visualization.HeatmapLayer({
        data: heatMapPoints
    });

    heatmap.setMap(map);
    heatmap.set("radius", heatmap.get("radius") ? null : 25);

   
    const image1 = "small.png";

  // INFO WINDOW INFORMATION FOR EACH BUILDING
    //
    //
    //
    //

    //These strings are used in the Google maps API info cards
    //They provide hourly traffic, busiest hours, building use, and address of each building
    const urecString = '<h1> University Recreational Center </h1>' +
        '<p>Average Hourly Traffic: ' + findAverageTraffic(buildingHashTable["UREC"]) +
        '<p>Busiest Hours: ' + findBusiestTime(buildingHashTable["UREC"]) +
        '<p>Building Use: Student Services</p>' +
        '<p>Address: 8827 CRAVER RD, Charlotte NC 28223 </p>';

    const atkinsString = '<h1> J. Murrey Atkins Library </h1>' +
        '<p>Average Hourly Traffic: ' + findAverageTraffic(buildingHashTable["ATKINS"]) +
        '<p>Busiest Hours: ' + findBusiestTime(buildingHashTable["ATKINS"]) +
        '<p>Building Use: Student Services</p>' +
        '<p>Address: 410 LIBRARY LN, Charlotte NC 28223 </p>';

    const belkString = '<h1> Belk Gym </h1>' +
        '<p>Average Hourly Traffic: ' + findAverageTraffic(buildingHashTable["BELKGYM"]) +
        '<p>Busiest Hours: ' + findBusiestTime(buildingHashTable["BELKGYM"]) +
        '<p>Building Use: Student Services</p>' +
        '<p>Address: 8911 University Rd, Charlotte, NC 28223 </p>';

    const studentUnionString = '<h1> Student Union </h1>' +
        '<p>Average Hourly Traffic: ' + findAverageTraffic(buildingHashTable["STUDENTUNION"]) +
        '<p>Busiest Hours: ' + findBusiestTime(buildingHashTable["STUDENTUNION"]) +
        '<p>Building Use: Student Services</p>' +
        '<p>Address: 8845 Craver RD, Charlotte NC 28223 </p>';

    const bursonString = '<h1> Burson </h1>' +
        '<p>Average Hourly Traffic: ' + findAverageTraffic(buildingHashTable["BURSON"]) +
        '<p>Busiest Hours: ' + findBusiestTime(buildingHashTable["BURSON"]) +
        '<p>Building Use: Instruction & Research</p>' +
        '<p>Address: 9006 CRAVER RD, Charlotte NC 28223 </p>';

    const cameronString = '<h1> Cameron </h1>' +
        '<p>Average Hourly Traffic: ' + findAverageTraffic(buildingHashTable["CAMERON"]) +
        '<p>Busiest Hours: ' + findBusiestTime(buildingHashTable["CAMERON"]) +
        '<p>Building Use: Instruction & Research</p>' +
        '<p>Address: 9010 CRAVER RD, Charlotte NC 28223 </p>';

    const dennyString = '<h1> Denny </h1>' +
        '<p>Average Hourly Traffic: ' + findAverageTraffic(buildingHashTable["DENNY"]) +
        '<p>Busiest Hours: ' + findBusiestTime(buildingHashTable["DENNY"]) +
        '<p>Building Use: Instruction & Research</p>' +
        '<p>Address: 9125 Mary Alexander Rd, Charlotte, NC 28223 </p>';

    const colvardString = '<h1> Colvard </h1>' +
        '<p>Average Hourly Traffic: ' + findAverageTraffic(buildingHashTable["COLVARD"]) +
        '<p>Busiest Hours: ' + findBusiestTime(buildingHashTable["COLVARD"]) +
        '<p>Building Use: Instruction & Research</p>' +
        '<p>Address: 9105 UNIVERSITY RD, Charlotte NC 28223 </p>';

    const dukeString = '<h1> Duke Centennial Hall </h1>' +
        '<p>Average Hourly Traffic: ' + findAverageTraffic(buildingHashTable["DUKE"]) +
        '<p>Busiest Hours: ' + findBusiestTime(buildingHashTable["DUKE"]) +
        '<p>Building Use: Instruction & Research</p>' +
        '<p>Address: 9330 Robert D. Snyder Rd, Charlotte, NC 28223 </p>';

    const epicString = '<h1> EPIC </h1>' +
        '<p>Average Hourly Traffic: ' + findAverageTraffic(buildingHashTable["EPIC"]) +
        '<p>Busiest Hours: ' + findBusiestTime(buildingHashTable["EPIC"]) +
        '<p>Building Use: Instruction & Research</p>' +
        '<p>Address: 8700 Phillips Rd, Charlotte, NC 28223 </p>';

    const prospectorString = '<h1> Prospector </h1>' +
        '<p>Average Hourly Traffic: ' + findAverageTraffic(buildingHashTable["PROSPECTOR"]) +
        '<p>Busiest Hours: ' + findBusiestTime(buildingHashTable["PROSPECTOR"]) +
        '<p>Building Use:  Student Services</p>' +
        '<p>Address: Library Ln, Charlotte, NC 28223 </p>';

    const woodwardString = '<h1> Woodward Hall </h1>' +
        '<p>Average Hourly Traffic: ' + findAverageTraffic(buildingHashTable["WOODWARD"]) +
        '<p>Busiest Hours: ' + findBusiestTime(buildingHashTable["WOODWARD"]) +
        '<p>Building Use: Instruction & Research</p>' +
        '<p>Address: 8812 CRAVER RD, Charlotte NC 28223 </p>';

    const bioinformaticsString = '<h1> Bioinformatics </h1>' +
        '<p>Average Hourly Traffic: ' + findAverageTraffic(buildingHashTable["BIOINFORMATICS"]) +
        '<p>Busiest Hours: ' + findBusiestTime(buildingHashTable["BIOINFORMATICS"]) +
        '<p>Building Use: Instruction & Research</p>' +
        '<p>Address: 9331 Robert D. Snyder Rd, Charlotte, NC 28223 </p>';

    const coedString = '<h1> Cato College of Education </h1>' +
        '<p>Average Hourly Traffic: ' + findAverageTraffic(buildingHashTable["COED"]) +
        '<p>Busiest Hours: ' + findBusiestTime(buildingHashTable["COED"]) +
        '<p>Building Use: Instruction & Research</p>' +
        '<p>Address: 8838 Craver Rd, Charlotte, NC 28223 </p>';

    const coneString = '<h1> Cone </h1>' +
        '<p>Average Hourly Traffic: ' + findAverageTraffic(buildingHashTable["CONE"]) +
        '<p>Busiest Hours: ' + findBusiestTime(buildingHashTable["CONE"]) +
        '<p>Building Use: Instruction & Research</p>' +
        '<p>Address: 9025 University Rd, Charlotte, NC 28223 </p>';

    const fretwellString = '<h1> Fretwell </h1>' +
        '<p>Average Hourly Traffic: ' + findAverageTraffic(buildingHashTable["FRETWELL"]) +
        '<p>Busiest Hours: ' + findBusiestTime(buildingHashTable["FRETWELL"]) +
        '<p>Building Use: Instruction & Research</p>' +
        '<p>Address: 9203 Mary Alexander Rd, Charlotte, NC 28223 </p>';

    const portalString = '<h1> PORTAL </h1>' +
        '<p>Average Hourly Traffic: ' + findAverageTraffic(buildingHashTable["PORTAL"]) +
        '<p>Busiest Hours: ' + findBusiestTime(buildingHashTable["PORTAL"]) +
        '<p>Building Use: Auxiliary</p>' +
        '<p>Address: 9319 Robert D. Snyder Rd, Charlotte, NC 28223 </p>';

    const griggString = '<h1> Grigg Hall </h1>' +
        '<p>Average Hourly Traffic: ' + findAverageTraffic(buildingHashTable["GRIGG"]) +
        '<p>Busiest Hours: ' + findBusiestTime(buildingHashTable["GRIGG"]) +
        '<p>Building Use: Instruction & Research</p>' +
        '<p>Address: 9320 Robert D. Snyder Rd, Charlotte, NC 28223 </p>';

    const soviString = '<h1> Sovi </h1>' +
        '<p>Average Hourly Traffic: ' + findAverageTraffic(buildingHashTable["SOVI"]) +
        '<p>Busiest Hours: ' + findBusiestTime(buildingHashTable["SOVI"]) +
        '<p>Building Use: Student Services</p>' +
        '<p>Address: 8917 Johnson Alumni Way, Charlotte, NC 28262 </p>';

    const chhsString = '<h1> College of Health and Human Services </h1>' +
        '<p>Average Hourly Traffic: ' + findAverageTraffic(buildingHashTable["CHHS"]) +
        '<p>Busiest Hours: ' + findBusiestTime(buildingHashTable["CHHS"]) +
        '<p>Building Use: Instruction & Research</p>' +
        '<p>Address: 8844 Craver Rd, Charlotte, NC 28223 </p>';

    const kingString = '<h1> King </h1>' +
        '<p>Average Hourly Traffic: ' + findAverageTraffic(buildingHashTable["KING"]) +
        '<p>Busiest Hours: ' + findBusiestTime(buildingHashTable["KING"]) +
        '<p>Building Use: Instruction & Research</p>' +
        '<p>Address: 9037 University Rd, Charlotte, NC 28223 </p>';

    const kennedyString = '<h1> Kennedy </h1>' +
        '<p>Average Hourly Traffic: ' + findAverageTraffic(buildingHashTable["KENNEDY"]) +
        '<p>Busiest Hours: ' + findBusiestTime(buildingHashTable["KENNEDY"]) +
        '<p>Building Use: Instruction & Research</p>' +
        '<p>Address: 9214 South, Library Ln, Charlotte, NC 28223 </p>';

    const roweString = '<h1> Rowe </h1>' +
        '<p>Average Hourly Traffic: ' + findAverageTraffic(buildingHashTable["ROWE"]) +
        '<p>Busiest Hours: ' + findBusiestTime(buildingHashTable["ROWE"]) +
        '<p>Building Use: Instruction & Research</p>' +
        '<p>Address: 9119 University Rd, Charlotte, NC 28223 </p>';

    const mceniryString = '<h1> McEniry </h1>' +
        '<p>Average Hourly Traffic: ' + findAverageTraffic(buildingHashTable["MCENIRY"]) +
        '<p>Busiest Hours: ' + findBusiestTime(buildingHashTable["MCENIRY"]) +
        '<p>Building Use: Instruction & Research</p>' +
        '<p>Address: 9215 Mary Alexander Rd, Charlotte, NC 28223 </p>';

    const fridayString = '<h1> Belk College of Business (Friday) </h1>' +
        '<p>Average Hourly Traffic: ' + findAverageTraffic(buildingHashTable["FRIDAY"]) +
        '<p>Busiest Hours: ' + findBusiestTime(buildingHashTable["FRIDAY"]) +
        '<p>Building Use: Instruction & Research</p>' +
        '<p>Address: 9209 Mary Alexander Rd, Charlotte, NC 28262 </p>';

    const barnardString = '<h1> Barnard </h1>' +
        '<p>Average Hourly Traffic: ' + findAverageTraffic(buildingHashTable["BARNARD"]) +
        '<p>Busiest Hours: ' + findBusiestTime(buildingHashTable["BARNARD"]) +
        '<p>Building Use: Instruction & Research</p>' +
        '<p>Address: 9129 Mary Alexander Rd, Charlotte, NC 28223 </p>';

    const macyString = '<h1> Macy </h1>' +
        '<p>Average Hourly Traffic: ' + findAverageTraffic(buildingHashTable["MACY"]) +
        '<p>Busiest Hours: ' + findBusiestTime(buildingHashTable["MACY"]) +
        '<p>Building Use: Instruction & Research</p>' +
        '<p>Address: 9224 Library Ln, Charlotte, NC 28262 </p>';

    const garingerString = '<h1> Garinger </h1>' +
        '<p>Average Hourly Traffic: ' + findAverageTraffic(buildingHashTable["GARINGER"]) +
        '<p>Busiest Hours: ' + findBusiestTime(buildingHashTable["GARINGER"]) +
        '<p>Building Use: Instruction & Research</p>' +
        '<p>Address: 9121 Mary Alexander Rd, Charlotte, NC 28223 </p>';

    const winninghamString = '<h1> Winningham </h1>' +
        '<p>Average Hourly Traffic: ' + findAverageTraffic(buildingHashTable["WINNINGHAM"]) +
        '<p>Busiest Hours: ' + findBusiestTime(buildingHashTable["WINNINGHAM"]) +
        '<p>Building Use: Instruction & Research</p>' +
        '<p>Address: 9236 SOUTH, Library Ln, Charlotte, NC 28223 </p>';

    const robinsonString = '<h1> Robinson </h1>' +
        '<p>Average Hourly Traffic: ' + findAverageTraffic(buildingHashTable["ROBINSON"]) +
        '<p>Busiest Hours: ' + findBusiestTime(buildingHashTable["ROBINSON"]) +
        '<p>Building Use: Instruction & Research</p>' +
        '<p>Address: 9027 Mary Alexander Rd, Charlotte, NC 28223 </p>';

    const storrsString = '<h1> Storrs School of Architecture </h1>' +
        '<p>Average Hourly Traffic: ' + findAverageTraffic(buildingHashTable["STORRS"]) +
        '<p>Busiest Hours: ' +  findBusiestTime(buildingHashTable["STORRS"]) +
        '<p>Building Use: Instruction & Research</p>' +
        '<p>Address: 9115 Mary Alexander Rd, Charlotte, NC 28262 </p>';

    // End of info strings for buildings
    //
    //
    //

    
    
    
      //All of this must be done in initmap, since it is all google maps related objects
    //This establishes all shapes, markers, info windows, and onclick events for each building
    //
    //
    //
    //
    
    //UREC
    
    //This is a shape made in the Google Maps API. The paths are the coordinates of each corner
    //strokeOpacity and fillOpacity make the shape invisible since the user can see the building and click on it
    const urecShape = new google.maps.Polygon({
        paths: urecShapeCoords,
        strokeOpacity: 0.0,
        fillOpacity: 0.0,
    });
    urecShape.setMap(map);

    //This is a Google Maps API info window, which is using the before created info strings for each building
    const urecWindow = new google.maps.InfoWindow({
        content: urecString,
        ariaLabel: "urec",
    });

    //This is a Google Maps API marker, which is critical for opening the info window via on click event
    //It's position is set to the building
    //The marker is invisible and is where the info window will actually show up when the building shape is clicked
    const urecMarker = new google.maps.Marker({
        position: {lat: cordinateMapX.get(buildingHashTable["UREC"]), lng: cordinateMapY.get(buildingHashTable["UREC"])},
        map,
        icon: image1,
        visible: false,
    });

    //This adds a listener for when the user clicks on the shape of the building
    //The click prompts the infowindow to open where the marker for the building is
    urecShape.addListener("click", () => {
        urecWindow.open({
            anchor: urecMarker,
            map,
        });
    });

    //This listener causes info windows to close when the user clicks somewhere else on the map
    google.maps.event.addListener(map, "click", function(event) {
        urecWindow.close();
    });


    //The rest of the buildings follow the exact same process for creating
    //Shapes, Info windows, and markers, as well as the events to use them

    //Atkins

    const atkinsShape = new google.maps.Polygon({
        paths: atkinsShapeCoords,
        strokeOpacity: 0.0,
        fillOpacity: 0.0,
    });
    atkinsShape.setMap(map);
    const atkinsWindow = new google.maps.InfoWindow({
        content: atkinsString,
        ariaLabel: "atkins",
    });
    const atkinsMarker = new google.maps.Marker({
        position: {lat: cordinateMapX.get(buildingHashTable["ATKINS"]), lng: cordinateMapY.get(buildingHashTable["ATKINS"])},
        map,
        icon: image1,
        visible: false,
    });
    atkinsShape.addListener("click", () => {
        atkinsWindow.open({
            anchor: atkinsMarker,
            map,
        });
    });
    google.maps.event.addListener(map, "click", function(event) {
        atkinsWindow.close();
    });

    //Belk

    const belkShape = new google.maps.Polygon({
        paths: belkShapeCoords,
        strokeOpacity: 0.0,
        fillOpacity: 0.0,
    });
    belkShape.setMap(map);
    const belkWindow = new google.maps.InfoWindow({
        content: belkString,
        ariaLabel: "belk",
    });
    const belkMarker = new google.maps.Marker({
        position: {lat: cordinateMapX.get(buildingHashTable["BELKGYM"]), lng: cordinateMapY.get(buildingHashTable["BELKGYM"])},
        map,
        icon: image1,
        visible: false,
    });
    belkShape.addListener("click", () => {
        belkWindow.open({
            anchor: belkMarker,
            map,
        });
    });
    google.maps.event.addListener(map, "click", function(event) {
        belkWindow.close();
    });

    //Student Union

    const studentUnionShape = new google.maps.Polygon({
        paths: studentUnionShapeCoords,
        strokeOpacity: 0.0,
        fillOpacity: 0.0,
    });
    studentUnionShape.setMap(map);
    const studentUnionWindow = new google.maps.InfoWindow({
        content: studentUnionString,
        ariaLabel: "studentUnion",
    });
    const studentUnionMarker = new google.maps.Marker({
        position: {lat: cordinateMapX.get(buildingHashTable["STUDENTUNION"]), lng: cordinateMapY.get(buildingHashTable["STUDENTUNION"])},
        map,
        icon: image1,
        visible: false,
    });
    studentUnionShape.addListener("click", () => {
        studentUnionWindow.open({
            anchor: studentUnionMarker,
            map,
        });
    });
    google.maps.event.addListener(map, "click", function(event) {
        studentUnionWindow.close();
    });

    //Burson

    const bursonShape = new google.maps.Polygon({
        paths: bursonShapeCoords,
        strokeOpacity: 0.0,
        fillOpacity: 0.0,
    });
    bursonShape.setMap(map);
    const bursonWindow = new google.maps.InfoWindow({
        content: bursonString,
        ariaLabel: "burson",
    });
    const bursonMarker = new google.maps.Marker({
        position: {lat: cordinateMapX.get(buildingHashTable["BURSON"]), lng: cordinateMapY.get(buildingHashTable["BURSON"])},
        map,
        icon: image1,
        visible: false,
    });
    bursonShape.addListener("click", () => {
        bursonWindow.open({
            anchor: bursonMarker,
            map,
        });
    });
    google.maps.event.addListener(map, "click", function(event) {
        bursonWindow.close();
    });

    //Cameron

    const cameronShape = new google.maps.Polygon({
        paths: cameronShapeCoords,
        strokeOpacity: 0.0,
        fillOpacity: 0.0,
    });
    cameronShape.setMap(map);
    const cameronWindow = new google.maps.InfoWindow({
        content: cameronString,
        ariaLabel: "",
    });
    const cameronMarker = new google.maps.Marker({
        position: {lat: cordinateMapX.get(buildingHashTable["CAMERON"]), lng: cordinateMapY.get(buildingHashTable["CAMERON"])},
        map,
        icon: image1,
        visible: false,
    });
    cameronShape.addListener("click", () => {
        cameronWindow.open({
            anchor: cameronMarker,
            map,
        });
    });
    google.maps.event.addListener(map, "click", function(event) {
        cameronWindow.close();
    });


    //DENNY

    const dennyShape = new google.maps.Polygon({
        paths: dennyShapeCoords,
        strokeOpacity: 0.0,
        fillOpacity: 0.0,
    });
    dennyShape.setMap(map);
    const dennyWindow = new google.maps.InfoWindow({
        content: dennyString,
        ariaLabel: "denny",
    });
    const dennyMarker = new google.maps.Marker({
        position: {lat: cordinateMapX.get(buildingHashTable["DENNY"]), lng: cordinateMapY.get(buildingHashTable["DENNY"])},
        map,
        icon: image1,
        visible: false,
    });
    dennyShape.addListener("click", () => {
        dennyWindow.open({
            anchor: dennyMarker,
            map,
        });
    });
    google.maps.event.addListener(map, "click", function(event) {
        dennyWindow.close();
    });

    //Colvard

    const colvardShape = new google.maps.Polygon({
        paths: colvardShapeCoords,
        strokeOpacity: 0.0,
        fillOpacity: 0.0,
    });
    colvardShape.setMap(map);
    const colvardWindow = new google.maps.InfoWindow({
        content: colvardString,
        ariaLabel: "colvard",
    });
    const colvardMarker = new google.maps.Marker({
        position: {lat: cordinateMapX.get(buildingHashTable["COLVARD"]), lng: cordinateMapY.get(buildingHashTable["COLVARD"])},
        map,
        icon: image1,
        visible: false,
    });
    colvardShape.addListener("click", () => {
        colvardWindow.open({
            anchor: colvardMarker,
            map,
        });
    });
    google.maps.event.addListener(map, "click", function(event) {
        colvardWindow.close();
    });

    //Duke

    const dukeShape = new google.maps.Polygon({
        paths: dukeShapeCoords,
        strokeColor: "#FF0000",
        strokeOpacity: 0.0,
        strokeWeight: 1,
        fillColor: "#085212",
        fillOpacity: 0.0,
    });
    dukeShape.setMap(map);
    const dukeWindow = new google.maps.InfoWindow({
        content: dukeString,
        ariaLabel: "duke",
    });
    const dukeMarker = new google.maps.Marker({
        position: {lat: cordinateMapX.get(buildingHashTable["DUKE"]), lng: cordinateMapY.get(buildingHashTable["DUKE"])},
        map,
        icon: image1,
        visible: false,
    });
    dukeShape.addListener("click", () => {
        dukeWindow.open({
            anchor: dukeMarker,
            map,
        });
    });
    google.maps.event.addListener(map, "click", function(event) {
        dukeWindow.close();
    });

    //EPIC

    const epicShape = new google.maps.Polygon({
        paths: epicShapeCoords,
        strokeOpacity: 0.0,
        fillOpacity: 0.0,
    });
    epicShape.setMap(map);
    const epicWindow = new google.maps.InfoWindow({
        content: epicString,
        ariaLabel: "epic",
    });
    const epicMarker = new google.maps.Marker({
        position: {lat: cordinateMapX.get(buildingHashTable["EPIC"]), lng: cordinateMapY.get(buildingHashTable["EPIC"])},
        map,
        icon: image1,
        visible: false,
    });
    epicShape.addListener("click", () => {
        epicWindow.open({
            anchor: epicMarker,
            map,
        });
    });
    google.maps.event.addListener(map, "click", function(event) {
        epicWindow.close();
    });

    //Prospector

    const prospectorShape = new google.maps.Polygon({
        paths: prospectorShapeCoords,
        strokeOpacity: 0.0,
        fillOpacity: 0.0,
    });
    prospectorShape.setMap(map);
    const prospectorWindow = new google.maps.InfoWindow({
        content: prospectorString,
        ariaLabel: "prospector",
    });
    const prospectorMarker = new google.maps.Marker({
        position: {lat: cordinateMapX.get(buildingHashTable["PROSPECTOR"]), lng: cordinateMapY.get(buildingHashTable["PROSPECTOR"])},
        map,
        icon: image1,
        visible: false,
    });
    prospectorShape.addListener("click", () => {
        prospectorWindow.open({
            anchor: prospectorMarker,
            map,
        });
    });
    google.maps.event.addListener(map, "click", function(event) {
        prospectorWindow.close();
    });

    //Woodward

    const woodwardShape = new google.maps.Polygon({
        paths: woodwardShapeCoords,
        strokeOpacity: 0.0,
        fillOpacity: 0.0,
    });
    woodwardShape.setMap(map);
    const woodwardWindow = new google.maps.InfoWindow({
        content: woodwardString,
        ariaLabel: "woodward",
    });
    const woodwardMarker = new google.maps.Marker({
        position: {lat: cordinateMapX.get(buildingHashTable["WOODWARD"]), lng: cordinateMapY.get(buildingHashTable["WOODWARD"])},
        map,
        icon: image1,
        visible: false,
    });
    woodwardShape.addListener("click", () => {
        woodwardWindow.open({
            anchor: woodwardMarker,
            map,
        });
    });
    google.maps.event.addListener(map, "click", function(event) {
        woodwardWindow.close();
    });

    //Bioinformatics

    const bioinformaticsShape = new google.maps.Polygon({
        paths: bioinformaticsShapeCoords,
        strokeOpacity: 0.0,
        fillOpacity: 0.0,
    });
    bioinformaticsShape.setMap(map);
    const bioinformaticsWindow = new google.maps.InfoWindow({
        content: bioinformaticsString,
        ariaLabel: "bioinformatics",
    });
    const bioinformaticsMarker = new google.maps.Marker({
        position: {lat: cordinateMapX.get(buildingHashTable["BIOINFORMATICS"]), lng: cordinateMapY.get(buildingHashTable["BIOINFORMATICS"])},
        map,
        icon: image1,
        visible: false,
    });
    bioinformaticsShape.addListener("click", () => {
        bioinformaticsWindow.open({
            anchor: bioinformaticsMarker,
            map,
        });
    });
    google.maps.event.addListener(map, "click", function(event) {
        bioinformaticsWindow.close();
    });

    //Cato College of Education

    const coedShape = new google.maps.Polygon({
        paths: coedShapeCoords,
        strokeOpacity: 0.0,
        fillOpacity: 0.0,
    });
    coedShape.setMap(map);
    const coedWindow = new google.maps.InfoWindow({
        content: coedString,
        ariaLabel: "coed",
    });
    const coedMarker = new google.maps.Marker({
        position: {lat: cordinateMapX.get(buildingHashTable["COED"]), lng: cordinateMapY.get(buildingHashTable["COED"])},
        map,
        icon: image1,
        visible: false,
    });
    coedShape.addListener("click", () => {
        coedWindow.open({
            anchor: coedMarker,
            map,
        });
    });
    google.maps.event.addListener(map, "click", function(event) {
        coedWindow.close();
    });

    //Cone

    const coneShape = new google.maps.Polygon({
        paths: coneShapeCoords,
        strokeOpacity: 0.0,
        fillOpacity: 0.0,
    });
    coneShape.setMap(map);
    const coneWindow = new google.maps.InfoWindow({
        content: coneString,
        ariaLabel: "cone",
    });
    const coneMarker = new google.maps.Marker({
        position: {lat: cordinateMapX.get(buildingHashTable["CONE"]), lng: cordinateMapY.get(buildingHashTable["CONE"])},
        map,
        icon: image1,
        visible: false,
    });
    coneShape.addListener("click", () => {
        coneWindow.open({
            anchor: coneMarker,
            map,
        });
    });
    google.maps.event.addListener(map, "click", function(event) {
        coneWindow.close();
    });

    //Fretwell

    const fretwellShape = new google.maps.Polygon({
        paths: fretwellShapeCoords,
        strokeOpacity: 0.0,
        fillOpacity: 0.0,
    });
    fretwellShape.setMap(map);
    const fretwellWindow = new google.maps.InfoWindow({
        content: fretwellString,
        ariaLabel: "fretwell",
    });
    const fretwellMarker = new google.maps.Marker({
        position: {lat: cordinateMapX.get(buildingHashTable["FRETWELL"]), lng: cordinateMapY.get(buildingHashTable["FRETWELL"])},
        map,
        icon: image1,
        visible: false,
    });
    fretwellShape.addListener("click", () => {
        fretwellWindow.open({
            anchor: fretwellMarker,
            map,
        });
    });
    google.maps.event.addListener(map, "click", function(event) {
        fretwellWindow.close();
    });

    //PORTAL

    const portalShape = new google.maps.Polygon({
        paths: portalShapeCoords,
        strokeOpacity: 0.0,
        fillOpacity: 0.0,
    });
    portalShape.setMap(map);
    const portalWindow = new google.maps.InfoWindow({
        content: portalString,
        ariaLabel: "portal",
    });
    const portalMarker = new google.maps.Marker({
        position: {lat: cordinateMapX.get(buildingHashTable["PORTAL"]), lng: cordinateMapY.get(buildingHashTable["PORTAL"])},
        map,
        icon: image1,
        visible: false,
    });
    portalShape.addListener("click", () => {
        portalWindow.open({
            anchor: portalMarker,
            map,
        });
    });
    google.maps.event.addListener(map, "click", function(event) {
        portalWindow.close();
    });

    //Grigg

    const griggShape = new google.maps.Polygon({
        paths: griggShapeCoords,
        strokeOpacity: 0.0,
        fillOpacity: 0.0,
    });
    griggShape.setMap(map);
    const griggWindow = new google.maps.InfoWindow({
        content: griggString,
        ariaLabel: "grigg",
    });
    const griggMarker = new google.maps.Marker({
        position: {lat: cordinateMapX.get(buildingHashTable["GRIGG"]), lng: cordinateMapY.get(buildingHashTable["GRIGG"])},
        map,
        icon: image1,
        visible: false,
    });
    griggShape.addListener("click", () => {
        griggWindow.open({
            anchor: griggMarker,
            map,
        });
    });
    google.maps.event.addListener(map, "click", function(event) {
        griggWindow.close();
    });

    //SOVI

    const soviShape = new google.maps.Polygon({
        paths: soviShapeCoords,
        strokeOpacity: 0.0,
        fillOpacity: 0.0,
    });
    soviShape.setMap(map);
    const soviWindow = new google.maps.InfoWindow({
        content: soviString,
        ariaLabel: "sovi",
    });
    const soviMarker = new google.maps.Marker({
        position: {lat: cordinateMapX.get(buildingHashTable["SOVI"]), lng: cordinateMapY.get(buildingHashTable["SOVI"])},
        map,
        icon: image1,
        visible: false,
    });
    soviShape.addListener("click", () => {
        soviWindow.open({
            anchor: soviMarker,
            map,
        });
    });
    google.maps.event.addListener(map, "click", function(event) {
        soviWindow.close();
    });

    //College of Health and Human Services (CHHS)

    const chhsShape = new google.maps.Polygon({
        paths: chhsShapeCoords,
        strokeOpacity: 0.0,
        fillOpacity: 0.0,
    });
    chhsShape.setMap(map);
    const chhsWindow = new google.maps.InfoWindow({
        content: chhsString,
        ariaLabel: "chhs",
    });
    const chhsMarker = new google.maps.Marker({
        position: {lat: cordinateMapX.get(buildingHashTable["CHHS"]), lng: cordinateMapY.get(buildingHashTable["CHHS"])},
        map,
        icon: image1,
        visible: false,
    });
    chhsShape.addListener("click", () => {
        chhsWindow.open({
            anchor: chhsMarker,
            map,
        });
    });
    google.maps.event.addListener(map, "click", function(event) {
        chhsWindow.close();
    });

    //King

    const kingShape = new google.maps.Polygon({
        paths: kingShapeCoords,
        strokeOpacity: 0.0,
        fillOpacity: 0.0,
    });
    kingShape.setMap(map);
    const kingWindow = new google.maps.InfoWindow({
        content: kingString,
        ariaLabel: "king",
    });
    const kingMarker = new google.maps.Marker({
        position: {lat: cordinateMapX.get(buildingHashTable["KING"]), lng: cordinateMapY.get(buildingHashTable["KING"])},
        map,
        icon: image1,
        visible: false,
    });
    kingShape.addListener("click", () => {
        kingWindow.open({
            anchor: kingMarker,
            map,
        });
    });
    google.maps.event.addListener(map, "click", function(event) {
        kingWindow.close();
    });

    //Kennedy

    const kennedyShape = new google.maps.Polygon({
        paths: kennedyShapeCoords,
        strokeOpacity: 0.0,
        fillOpacity: 0.0,
    });
    kennedyShape.setMap(map);
    const kennedyWindow = new google.maps.InfoWindow({
        content: kennedyString,
        ariaLabel: "kennedy",
    });
    const kennedyMarker = new google.maps.Marker({
        position: {lat: cordinateMapX.get(buildingHashTable["KENNEDY"]), lng: cordinateMapY.get(buildingHashTable["KENNEDY"])},
        map,
        icon: image1,
        visible: false,
    });
    kennedyShape.addListener("click", () => {
        kennedyWindow.open({
            anchor: kennedyMarker,
            map,
        });
    });
    google.maps.event.addListener(map, "click", function(event) {
        kennedyWindow.close();
    });

    //Rowe

    const roweShape = new google.maps.Polygon({
        paths: roweShapeCoords,
        strokeOpacity: 0.0,
        fillOpacity: 0.0,
    });
    roweShape.setMap(map);
    const roweWindow = new google.maps.InfoWindow({
        content: roweString,
        ariaLabel: "rowe",
    });
    const roweMarker = new google.maps.Marker({
        position: {lat: cordinateMapX.get(buildingHashTable["ROWE"]), lng: cordinateMapY.get(buildingHashTable["ROWE"])},
        map,
        icon: image1,
        visible: false,
    });
    roweShape.addListener("click", () => {
        roweWindow.open({
            anchor: roweMarker,
            map,
        });
    });
    google.maps.event.addListener(map, "click", function(event) {
        roweWindow.close();
    });

    //McEniry

    const mceniryShape = new google.maps.Polygon({
        paths: mceniryShapeCoords,
        strokeOpacity: 0.0,
        fillOpacity: 0.0,
    });
    mceniryShape.setMap(map);
    const mceniryWindow = new google.maps.InfoWindow({
        content: mceniryString,
        ariaLabel: "mceniry",
    });
    const mceniryMarker = new google.maps.Marker({
        position: {lat: cordinateMapX.get(buildingHashTable["MCENIRY"]), lng: cordinateMapY.get(buildingHashTable["MCENIRY"])},
        map,
        icon: image1,
        visible: false,
    });
    mceniryShape.addListener("click", () => {
        mceniryWindow.open({
            anchor: mceniryMarker,
            map,
        });
    });
    google.maps.event.addListener(map, "click", function(event) {
        mceniryWindow.close();
    });

    //Friday

    const fridayShape = new google.maps.Polygon({
        paths: fridayShapeCoords,
        strokeOpacity: 0.0,
        fillOpacity: 0.0,
    });
    fridayShape.setMap(map);
    const fridayWindow = new google.maps.InfoWindow({
        content: fridayString,
        ariaLabel: "friday",
    });
    const fridayMarker = new google.maps.Marker({
        position: {lat: cordinateMapX.get(buildingHashTable["FRIDAY"]), lng: cordinateMapY.get(buildingHashTable["FRIDAY"])},
        map,
        icon: image1,
        visible: false,
    });
    fridayShape.addListener("click", () => {
        fridayWindow.open({
            anchor: fridayMarker,
            map,
        });
    });
    google.maps.event.addListener(map, "click", function(event) {
        fridayWindow.close();
    });

    //Barnard

    const barnardShape = new google.maps.Polygon({
        paths: barnardShapeCoords,
        strokeOpacity: 0.0,
        fillOpacity: 0.0,
    });
    barnardShape.setMap(map);
    const barnardWindow = new google.maps.InfoWindow({
        content: barnardString,
        ariaLabel: "barnard",
    });
    const barnardMarker = new google.maps.Marker({
        position: {lat: cordinateMapX.get(buildingHashTable["BARNARD"]), lng: cordinateMapY.get(buildingHashTable["BARNARD"])},
        map,
        icon: image1,
        visible: false,
    });
    barnardShape.addListener("click", () => {
        barnardWindow.open({
            anchor: barnardMarker,
            map,
        });
    });
    google.maps.event.addListener(map, "click", function(event) {
        barnardWindow.close();
    });

    //Macy

    const macyShape = new google.maps.Polygon({
        paths: macyShapeCoords,
        strokeOpacity: 0.0,
        fillOpacity: 0.0,
    });
    macyShape.setMap(map);
    const macyWindow = new google.maps.InfoWindow({
        content: macyString,
        ariaLabel: "macy",
    });
    const macyMarker = new google.maps.Marker({
        position: {lat: cordinateMapX.get(buildingHashTable["MACY"]), lng: cordinateMapY.get(buildingHashTable["MACY"])},
        map,
        icon: image1,
        visible: false,
    });
    macyShape.addListener("click", () => {
        macyWindow.open({
            anchor: macyMarker,
            map,
        });
    });
    google.maps.event.addListener(map, "click", function(event) {
        macyWindow.close();
    });

    //Garinger

    const garingerShape = new google.maps.Polygon({
        paths: garingerShapeCoords,
        strokeOpacity: 0.0,
        fillOpacity: 0.0,
    });
    garingerShape.setMap(map);
    const garingerWindow = new google.maps.InfoWindow({
        content: garingerString,
        ariaLabel: "garinger",
    });
    const garingerMarker = new google.maps.Marker({
        position: {lat: cordinateMapX.get(buildingHashTable["GARINGER"]), lng: cordinateMapY.get(buildingHashTable["GARINGER"])},
        map,
        icon: image1,
        visible: false,
    });
    garingerShape.addListener("click", () => {
        garingerWindow.open({
            anchor: garingerMarker,
            map,
        });
    });
    google.maps.event.addListener(map, "click", function(event) {
        garingerWindow.close();
    });

    //Winningham

    const winninghamShape = new google.maps.Polygon({
        paths: winninghamShapeCoords,
        strokeOpacity: 0.0,
        fillOpacity: 0.0,
    });
    winninghamShape.setMap(map);
    const winninghamWindow = new google.maps.InfoWindow({
        content: winninghamString,
        ariaLabel: "winningham",
    });
    const winninghamMarker = new google.maps.Marker({
        position: {lat: cordinateMapX.get(buildingHashTable["WINNINGHAM"]), lng: cordinateMapY.get(buildingHashTable["WINNINGHAM"])},
        map,
        icon: image1,
        visible: false,
    });
    winninghamShape.addListener("click", () => {
        winninghamWindow.open({
            anchor: winninghamMarker,
            map,
        });
    });
    google.maps.event.addListener(map, "click", function(event) {
        winninghamWindow.close();
    });

    //Robinson

    const robinsonShape = new google.maps.Polygon({
        paths: robinsonShapeCoords,
        strokeOpacity: 0.0,
        fillOpacity: 0.0,
    });
    robinsonShape.setMap(map);
    const robinsonWindow = new google.maps.InfoWindow({
        content: robinsonString,
        ariaLabel: "robinson",
    });
    const robinsonMarker = new google.maps.Marker({
        position: {lat: cordinateMapX.get(buildingHashTable["ROBINSON"]), lng: cordinateMapY.get(buildingHashTable["ROBINSON"])},
        map,
        icon: image1,
        visible: false,
    });
    robinsonShape.addListener("click", () => {
        robinsonWindow.open({
            anchor: robinsonMarker,
            map,
        });
    });
    google.maps.event.addListener(map, "click", function(event) {
        robinsonWindow.close();
    });

    //Storrs

    const storrsShape = new google.maps.Polygon({
        paths: storrsShapeCoords,
        strokeOpacity: 0.0,
        fillOpacity: 0.0,
    });
    storrsShape.setMap(map);
    const storrsWindow = new google.maps.InfoWindow({
        content: storrsString,
        ariaLabel: "storrs",
    });
    const storrsMarker = new google.maps.Marker({
        position: {lat: cordinateMapX.get(buildingHashTable["STORRS"]), lng: cordinateMapY.get(buildingHashTable["STORRS"])},
        map,
        icon: image1,
        visible: false,
    });
    storrsShape.addListener("click", () => {
        storrsWindow.open({
            anchor: storrsMarker,
            map,
        });
    });
    google.maps.event.addListener(map, "click", function(event) {
        storrsWindow.close();
    });


    //
    //
    //
    //
    //
    //End of all info windows+markers etc.




}


//this resets variables and refreshes the actual map
async function mapRefresh(){

     //hiding menu divs in case they are open from previous activity
     $(".infoDiv").hide();
     $("#reccommendDiv").hide();
     $("#compareDiv").hide();
     $("#customInfoDiv").hide();
     $("#customMenuContainer").hide();
    //outputting initial time and file path
    //remember to clear aoutomated list: map points, weights
    myList = [];
    heatMapPoints = [];
    buildingWeight.clear();
    currentFilePath = "jsons/" + document.dtSelection.dateTime.value.substr(0,10) + ".json";
    currentHour = (document.dtSelection.dateTime.value.substr(11,11).substr(0,2));
    //since getData is asynchronous, we use a then function to initiate the map
    getData(currentFilePath, +currentHour).then(window.initMap = initMap).then(fillList).then(addBuildingInfo).then(fillRestaurantList);

}

//function will fill out the list using current data
async function fillList(){
  
    var html = "<input class=customExitButton type=button value=Exit id=customInfoDivExit>";
    html +="<table class=customTable><tr><th>Building</th><th>Current Traffic</th><th>Average Traffic</th><th>Busiest Time</th><th>Quietist Time</th></tr>";
    html += "<tbody>";

    //Looping through buildings map and filling putting the data in the list
    for (var prop in buildingHashTable){
        var tempTraffic = "";
        if(buildingWeight.get(buildingHashTable[prop]) != null ) {
            tempTraffic = buildingWeight.get(buildingHashTable[prop]);
            tempTraffic = Math.floor(tempTraffic/10)*10;
        } else {
            tempTraffic = 0;
        } 
        
   
        html +=  "<tr>" 
            //building name
            + "<td>" + buildingHashTable2[prop].NAME +"</td>"
            //current traffic
            + "<td>" 
            + tempTraffic
            +"</td>"
            //Average Traffic
            + "<td>" 
            + await getAverage(buildingHashTable2[prop].ABBREVIATION)
            +"</td>"
            //busiest time, use temp value for now
            + "<td>" + timeReturn(findBusiestTime(buildingHashTable[prop])) +"</td>"
            //quiestist time
            +"<td>" + timeReturn(findQuietistTime(buildingHashTable[prop])) +"</td>"
            //closing row
            + "</tr>";
            
        
    }
    html += "<tbody></table>"
    $('#customInfoDiv').html(html);

    $("#customInfoDivExit, #optionsMenuButton").click(function(){
        //console.log("Exit Button")
        $(".customInfoDiv").hide();
        
    });
  
}


//Find the busiest time for for building that day
function findBusiestTime(building){
    //to be used as return value
    var max = 0;
    var busiestHour;
    for(var list in myList){
        //next we need to grab each traffic for the current building and then return the max or min
        //grabbing list for hour
        let tempHour = myList[list];
        //grabbing traffic for building at current hour
        let tempTraffic = tempHour[building];
        //checking max
        if(tempTraffic > max){
            
            max = tempTraffic;
            busiestHour = list;
        }
    };
    
    return busiestHour;
    
   
}

//Needed to write this function for building info card, gets average traffic for the day
function findAverageTraffic(building){
    var sum = 0;
    var average = 0;
    for(var list in myList){
        //next we need to grab each traffic for the current building and then return the max or min
        //grabbing list for hour
        let tempHour = myList[list];
        //grabbing traffic for building at current hour
        let tempTraffic = tempHour[building];


        sum = sum+tempTraffic;


    };
    average = sum/24;

    return parseInt(average);

}

function findQuietistTime(building){
    //to be used as return value
    var min = 0;
    var quietistHour;
    
    for(var list in myList){

        //myList[list]: this grabs the the current hour list
        //next we need to grab each traffic for the current building and then return the max or min
        //grabbing list for hour
        let tempHour = myList[list];
        //grabbing traffic for building at current hour
        let tempTraffic = tempHour[building];

        if(min == 0 ){
            quietistHour = 0;
            min = tempTraffic;
        }
        
        //checking min
        if(tempTraffic < min){
            
            min = tempTraffic;
            quietistHour = list;
        }
    };
    
    return quietistHour;
    
   
}

//changes color of heatmap points to diffrenent color
function changeGradient() {
    //console.log("FunctionRAN")
    const gradient = [
      "rgba(0, 255, 255, 0)",
      "rgba(0, 255, 255, 1)",
      "rgba(0, 191, 255, 1)",
      "rgba(0, 127, 255, 1)",
      "rgba(0, 63, 255, 1)",
      "rgba(0, 0, 255, 1)",
      "rgba(0, 0, 223, 1)",
      "rgba(0, 0, 191, 1)",
      "rgba(0, 0, 159, 1)",
      "rgba(0, 0, 127, 1)",
      "rgba(63, 0, 91, 1)",
      "rgba(127, 0, 63, 1)",
      "rgba(191, 0, 31, 1)",
      "rgba(255, 0, 0, 1)",
    ];
    
    heatmap.set("gradient", heatmap.get("gradient") ? null : gradient);
  }


 async function fillRestaurantList(){
    $('#customInfoDiv').html("");
    var html = "<input class=customExitButton type=button value=Exit id=customInfoDivExit>";
    html +="<table class=customTable><tr><th>Restaurant</th><th>Building</th><th>Current Traffic</th><th>Average Traffic</th><th>Busiest Time</th></tr>";
    html += "<tbody>";

    //Looping through buildings map and putting the data in the list
    for (var prop in restaurantHashTable){
        var tempTraffic = "";
        var currentBuilding = restaurantHashTable[prop].BUILDING;
        if(buildingWeight.get(buildingHashTable[currentBuilding]) != null ) {
            tempTraffic = buildingWeight.get(buildingHashTable[currentBuilding]);
            tempTraffic = Math.floor(tempTraffic/10)*10;
            
        } else {
            tempTraffic = 0;
        } 
        html +=    "<tr>" 
            //Restaurant name
            + "<td>" + restaurantHashTable[prop].NAME +"</td>"
            //building name
            + "<td>" 
            + buildingHashTable2[currentBuilding].NAME
            +"</td>"
            //current traffic
            + "<td>" + tempTraffic +"</td>"
            //Average Traffic
            + "<td>" 
            + await getAverage(buildingHashTable2[currentBuilding].ABBREVIATION)
            +"</td>"
            //busiest time, use temp value for now
            +"<td>" + timeReturn(findBusiestTime(buildingHashTable[currentBuilding])) +"</td>"
            //closing div
            + "</tr>";
        
        
       
        
    }

    html += "<tbody></table>"
    //adding html to div
    $('#customInfoDiv').html(html);
    //setting functionality for exit button on div
    $("#customInfoDivExit, #optionsMenuButton").click(function(){

        $(".customInfoDiv").hide();
        
    });
    
  }

//function for generating a recommendation on recommend div
function generateReccomendation(){

    //getting selceted options from user
  
    var time1 = parseFloat($("#time1").find(":selected").val());
    var time2 = parseFloat($("#time2").find(":selected").val());

    var averageDivider = time2 - time1 + 1;

    //starting with code to find least busy building
    //choosing robinson as a comparison for the rest of the list 
  
    var buildingAverages = new Map();
    for(time1; time1<=time2; time1++){
        
        //looping through every building we are using using building hash table
        for(var building in buildingHashTable){

        //Here we set the building total traffic over the hours selected by the user
        if(!(building in buildingAverages.keys())){
            //if builing not in hashtable add it
            buildingAverages.set(building,  myList[time1][buildingHashTable[building]]);
        }else{
            //if building exist in hashtable, update its value with traffic from current hour
            buildingAverages.set(building, buildingAverages.get(building) + myList[time1][buildingHashTable[building]]);
        }   
           
            
        }
    }

    //now average out all values in hashtable by diving it with total hours used set in averageDivider

    for(var key of buildingAverages.keys()){
        buildingAverages.set(key, buildingAverages.get(key) / averageDivider);
        //console.log(key);
    }
    
    //lastly we get the min or max value building based on what user selected they were looking for 
    var returnBuilding = "UREC";
    //finding least busy building for studying
    if($("#type").find(":selected").val() == "study"){
           
        for(var key of buildingAverages.keys()){
            if(buildingAverages.get(key) < buildingAverages.get(returnBuilding)){
                returnBuilding = key;
            }
            
        }
        //creating div with result
        $("#recommendationResult").html("");
        $("#recommendationResult").append(
            "From "
            +timeReturn($("#time1").find(":selected").val()) 
            +" to "
            +timeReturn($("#time2").find(":selected").val())
            + ", <br> "
            +buildingHashTable2[returnBuilding].NAME
            + " was the least busy."
        );

    }else if($("#type").find(":selected").val() == "advertise"){
        //finding busiest building for advertising
        for(var key of buildingAverages.keys()){
            if(buildingAverages.get(key) > buildingAverages.get(returnBuilding)){
                returnBuilding = key;
            }
            
        }
        //creating div with result
        $("#recommendationResult").html("");
        $("#recommendationResult").append(
            "From "
            +$("#time1").find(":selected").val() 
            +":00 to "
            +$("#time2").find(":selected").val()
            + ":00, <br> "
            +buildingHashTable2[returnBuilding].NAME
            + " was the most busy."
        );

    }
    
  }


//filling selects with buildings in buildings hashtable
function fillCompareSelect(){
   
    for(var building in buildingHashTable2){
      
        $("#compare1").append(
            "<option value ="
            //value set to current building from loop
            +building
            +">"
            //setting text to building from loop
            +buildingHashTable2[building].NAME
            //closing option div
            +"</option>"
        )
        $("#compare2").append(
            "<option value ="
            //value set to current building from loop
            +building
            +">"
            //setting text to building from loop
            +buildingHashTable2[building].NAME
            //closing option div
            +"</option>"
        )
    }
    $("#compare1").selectmenu("refresh");
    $("#compare2").selectmenu("refresh");
}

//adding selected building info to compare div
async function addBuildingInfo(){ 
    
    
    //setting the initial state of the building info p tags
    $("#building1Info p:eq(0)").html("Current Traffic: ");
    $("#building1Info p:eq(1)").html("Busiest Time: ");
    $("#building1Info p:eq(2)").html("Average Foot Traffic: ");
    $("#building1Info p:eq(3)").html("");
    $("#building2Info p:eq(0)").html("Current Traffic: ");
    $("#building2Info p:eq(1)").html("Busiest Time: ");
    $("#building2Info p:eq(2)").html("Average Foot Traffic: ");
    $("#building2Info p:eq(3)").html("");
    

    $("#compareCurrentHour").html("Current Time: " + timeReturn(currentHour));
   
    //setting variable to day chosen
    var day1 = "jsons/" + document.building1DateTimeForm.building1DateTime.value + ".json";
    var day2 = "jsons/" + document.building2DateTimeForm.building2DateTime.value + ".json";

    //variable for highest and lowest traffic retunr objects
    var tempLowTrafficObject = await getLowestTraficOnDay(buildingHashTable[$("#compare1").find(":selected").val()], day1);
    var tempHighTrafficObject = await getHighestTraficOnDay(buildingHashTable[$("#compare1").find(":selected").val()], day1);
    //getting current traffic of building 1
    var tempTraffic1 = buildingWeight.get(buildingHashTable[$("#compare1").find(":selected").val()]);
    tempTraffic1 = Math.floor(tempTraffic1/10)*10;
  
    //appending traffic and busiest time to building one info + other info
    
    $("#building1Info p:eq(0)").append(await getCurrentTraffic("jsons/" + document.building1DateTimeForm.building1DateTime.value + ".json", buildingHashTable2[$("#compare1").find(":selected").val()].ABBREVIATION));
    $("#building1Info p:eq(1)").append(tempHighTrafficObject.HOUR);
    $("#building1Info p:eq(2)").append(await getAverageOnDay(buildingHashTable[$("#compare1").find(":selected").val()], day1) );
    $("#building1Info p:eq(3)").append("<p>Lowest Traffic: " 
                                + tempLowTrafficObject.TRAFFIC
                                + " at "
                                + timeReturn(tempLowTrafficObject.HOUR)
                                +"</p>"
    );
    $("#building1Info p:eq(4)").append("<p>Highest Traffic: " 
                                + tempHighTrafficObject.TRAFFIC
                                + " at "
                                + timeReturn(tempHighTrafficObject.HOUR)
                                +"</p>"
    );


     // setting variable for highest and lowest traffic return object to second buildiong
     tempLowTrafficObject = await getLowestTraficOnDay(buildingHashTable[$("#compare2").find(":selected").val()], day2);
     tempHighTrafficObject = await getHighestTraficOnDay(buildingHashTable[$("#compare2").find(":selected").val()], day2);

 
   
     //appending traffic and busiest time to building two info + other info
     $("#building2Info p:eq(0)").append(await getCurrentTraffic("jsons/" + document.building2DateTimeForm.building2DateTime.value + ".json", buildingHashTable2[$("#compare2").find(":selected").val()].ABBREVIATION));
     $("#building2Info p:eq(1)").append(tempHighTrafficObject.HOUR);
     $("#building2Info p:eq(2)").append(await getAverageOnDay(buildingHashTable[$("#compare2").find(":selected").val()], day2 ));
     $("#building2Info p:eq(3)").append("<p>Lowest Traffic: " 
     + tempLowTrafficObject.TRAFFIC
     + " at "
     + timeReturn(tempLowTrafficObject.HOUR)
     +"</p>"
     
);
    $("#building2Info p:eq(4)").append("<p>Highest Traffic: " 
    + tempHighTrafficObject.TRAFFIC
    + " at "
    + timeReturn(tempHighTrafficObject.HOUR)
    +"</p>"
    );
   
    
   
  

}


//changes size of heatmap points
function changeSize() {
    if( heatmap.get("radius") == 25){
        heatmap.set("radius",45);
    }else if(heatmap.get("radius") == 45){
        heatmap.set("radius",15);
    }else{
        heatmap.set("radius",25);
    }
    
   
    
    
}

//changes opacity of heat map pints
 function changeOpacity(){
    

    if( heatmap.get("opacity") == 0.5){

        heatmap.set("opacity",  0.7);
        
    }else if(heatmap.get("opacity") == 0.7){
        heatmap.set("opacity",  1);
    }else{
        heatmap.set("opacity",  0.5);
    }
    
  }
  //function returns average traffic of passed building 
  //building in this case is being sent as the abbreviation used in JSON files
  async function getAverage(building){

    var total = 0;
    //get the json file
    await $.ajax({
        type: "get",
        //current file path if gloabl variable used in initial parse of json file for map, can be used here
        url: currentFilePath,
        beforeSend: function() {
    
        },
        timeout: 10000,
        error: function(xhr, status, error) {
            alert("Error: " + xhr.status + " - " + error);
        },
        dataType: "json",
        success:  function(data) {
            //console.log(data);
            
            //parse through each hour
              $.each(data,  function(){
               
                //find building we are currently looking for
                 $.each(this, function(key,value){
                    if(key == building){
                        
                        //add current foot traffic to variable
                        total += value;
                    }

                });
                
                
            });
            //get average by diving by 24 for 24 hours
            total = total/24
        }

        
    });

    return Math.floor(total);
    
  }
  //same as getAVerage but with specific day
  async function getAverageOnDay(building, day){

    var total = 0;
    //get the json file
    await $.ajax({
        type: "get",
        //current file path if gloabl variable used in initial parse of json file for map, can be used here
        url: day,
        beforeSend: function() {
    
        },
        timeout: 10000,
        error: function(xhr, status, error) {
            alert("Error 111: " + xhr.status + " - " + error);
        },
        dataType: "json",
        success:  function(data) {
            //console.log(data);
            
            //parse through each hour
              $.each(data,  function(){
               
                //find building we are currently looking for
                 $.each(this, function(key,value){
                    if(key == building){
                        
                        //add current foot traffic to variable
                        total += value;
                    }

                });
                
                
            });
            //get average by diving by 24 for 24 hours
            total = total/24
        }

        
    });

    return Math.floor(total);
    
  }

    //function returns lowest traffic of passed building 
    //building in this case is being sent as the abbreviation used in JSON files
    async function getLowestTrafic(building){
       console.log(building);
     
        
        var lowest =  await getAverage(building);
        var hour = 0;
      
        //get the json file
        await $.ajax({
            type: "get",
            //current file path if gloabl variable used in initial parse of json file for map, can be used here
            url: currentFilePath,
            beforeSend: function() {
        
            },
            timeout: 10000,
            error: function(xhr, status, error) {
                alert("Error: " + xhr.status + " - " + error);
            },
            dataType: "json",
            success:  function(data) {

                //parse through each hour
                  $.each(data,  function(){
                    var tempHour = this.Buildings;
                    //find building we are currently looking for
                     $.each(this, function(key,value){
                        //comapring current time foot traffic to lowest variable
                        if(key == building && value < lowest ){
                        
                            lowest = value;
                            hour = tempHour;
                        }
    
                    });
                    
                    
                });
                
            }
    
            
        });
       
        return {TRAFFIC: lowest, HOUR: hour};
        
      }
      //same as getLowestTraffic above but with specific day chosen
      async function getLowestTraficOnDay(building, day){
        
      
         
         var lowest =  await getAverage(building);
         var hour = 0;
       
         //get the json file
         await $.ajax({
             type: "get",
             //current file path if gloabl variable used in initial parse of json file for map, can be used here
             url: day,
             beforeSend: function() {
         
             },
             timeout: 10000,
             error: function(xhr, status, error) {
                 alert("Error: " + xhr.status + " - " + error);
             },
             dataType: "json",
             success:  function(data) {
 
                 //parse through each hour
                   $.each(data,  function(){
                     var tempHour = this.Buildings;
                     //find building we are currently looking for
                      $.each(this, function(key,value){
                         //comapring current time foot traffic to lowest variable
                         if(key == building && value < lowest ){
                         
                             lowest = value;
                             hour = tempHour;
                         }
     
                     });
                     
                     
                 });
                 
             }
     
             
         });
        
         return {TRAFFIC: lowest, HOUR: hour};
         
       }
     
    
    //function returns Highest traffic of passed building 
    //building in this case is being sent as the abbreviation used in JSON files
    //returns array with [TRAFFIC, HOUR]
async function getHighestTrafic(building){

    
        
        var highest =  await getAverage(building);
        var hour = 0;

    
        //get the json file
        await $.ajax({
            type: "get",
            //current file path if gloabl variable used in initial parse of json file for map, can be used here
            url: currentFilePath,
            beforeSend: function() {
        
            },
            timeout: 10000,
            error: function(xhr, status, error) {
                alert("Error: " + xhr.status + " - " + error);
            },
            dataType: "json",
            success:  function(data) {

                //parse through each hour
                $.each(data,  function(){
                
                var tempHour = this.Buildings;
                    //find building we are currently looking for
                    $.each(this, function(key,value){
                        //comapring current time foot traffic to lowest variable
                        if(key == building && value > highest ){
                        
                            highest = value;
                            hour = tempHour    ;
                        }
    
                    });
                    
                    
                });
                
            }
    
            
        });
    
        return {TRAFFIC: highest, HOUR: hour};
        
    }
//same as getHighestTraffic above but with specific day chosen
async function getHighestTraficOnDay(building, day){


    
var highest =  await getAverage(building);
var hour = 0;


//get the json file
await $.ajax({
    type: "get",
    //current file path if gloabl variable used in initial parse of json file for map, can be used here
    url: day,
    beforeSend: function() {

    },
    timeout: 10000,
    error: function(xhr, status, error) {
        alert("Error: " + xhr.status + " - " + error);
    },
    dataType: "json",
    success:  function(data) {

        //parse through each hour
            $.each(data,  function(){
            
            var tempHour = this.Buildings;
            //find building we are currently looking for
                $.each(this, function(key,value){
                //comapring current time foot traffic to lowest variable
                if(key == building && value > highest ){
                    
                    highest = value;
                    hour = tempHour    ;
                }

            });
            
            
        });
        
    }

    
});

return {TRAFFIC: highest, HOUR: hour};

}
     
       
//this is a fucntion to get current traffic, the map already gets the current traffic on the intial get data
//Other functions also use the getData population of building weight for current traffic
//This function is returning current traffic for cases in which we are using a different day from the map selected choice
//such as in the compare buildings menu
//day passed is the json file path while building is abbreviation of selected building
//For now, function will only use current hour that is being used by map
  async function getCurrentTraffic(day, building){
    
    let tempData = [];
    //get the json file
    await $.ajax({
        type: "get",
        //current file path is passed as day
        url: day,
        beforeSend: function() {
    
        },
        timeout: 10000,
        error: function(xhr, status, error) {
            alert("Error: " + xhr.status + " - " + error);
        },
        dataType: "json",
        success:  function(data) {
            //grabbing cuyrrent hour
             tempData = data[currentHour];
            
            
            
        }

        
    });
  
    return tempData[building];
    
  }
//changes words in time Button 
function timeButtonStateChange(){
    if($("#timeButton").attr("value") == "24 Hour"){
        $("#timeButton").attr("value", "12 Hour");
    }else{
        $("#timeButton").attr("value", "24 Hour");
    }
}

//function to return time in 24 or 12 hour format, time is passed as string,
function timeReturn(time){
    
    if(document.timeButtonForm.timeButton.value == "24 Hour"){
        return time;
    }else{
        if(+time == 0){
            
            return "1 AM"
        }
        else if(+time == 12){
            return "12 PM"
        }
        else if(+time < 13){
            return time + " AM"
        }
        //if time is above 12
        else{
            var temp = +time - 12;
            return temp.toString() + " PM"
        }
    }
    

}

