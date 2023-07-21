module.exports.getDate = getDate;

function getDate(){
    const today=new Date();
// const currentDay= today.getDay();
const options ={
    weekday : "long",
    day : "numeric",
    month: "long"
};
var day = today.toLocaleDateString("en-US",options)// to gate the date
return day;
}
//use this style to export the function

exports.getDay= function(){
    const today=new Date();
const options ={
    weekday : "long",
};
 return today.toLocaleDateString("en-US",options)
}

