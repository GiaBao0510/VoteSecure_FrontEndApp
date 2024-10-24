//Lấy thời điểm hiện tại
function currentDate(){
    const date = new  Date();
    return date.toLocaleDateString('vi-VN',{
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    });
}

export default{
    currentDate,
}