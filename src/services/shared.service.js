//Lấy thời điểm hiện tại
function currentDate(){
    const date = new Date();
    return date.toLocaleDateString('vi-VN',{
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    });
}

//Lấy thời điểm ngày giờ hiện tại điểm
function currentDateTime(){
    const now = new Date();
    let current = now.toLocaleString('en-GB',{
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    });
    
    let [date, time] = current.split(", ");
    date = date.split("/").reverse().join("-");

    return date + " " + time;
}



export default{
    currentDate,
    currentDateTime,
}