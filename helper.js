exports.getReturnAmount=(amt,r)=>{
    return amt*r;
}

exports.totalAmtToBePaid=(amt,r)=>{
    return amt*r/4;
}

exports.randomNumber=(min,max)=>{
    return Math.floor(Math.random()*(max+1-min)+min);
}