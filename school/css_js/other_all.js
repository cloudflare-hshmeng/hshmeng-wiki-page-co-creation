function toggleDetails(title){
    const details = title.nextElementSibling;
    if(details.style.display === 'block'){
        details.style.display = 'none';
    }else{
        details.style.display = 'block';
    }
}