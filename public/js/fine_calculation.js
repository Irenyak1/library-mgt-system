document.getElementById('actualReturnDate').addEventListener('change', function() {
    let actualReturnDate = new Date(document.getElementById('actualReturnDate').value);
    let specifiedReturnDate = new Date(document.getElementById('specifiedReturnDate').value);
    let fineStatusInput = document.getElementById('fineStatus');
    if (actualReturnDate > specifiedReturnDate) {
        fineStatusInput.value = 10;
    } else {
        fineStatusInput.value = '';
    }
});
