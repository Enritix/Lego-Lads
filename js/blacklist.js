document.querySelectorAll('.remove-btn').forEach(button => {
    button.addEventListener('click', function () {
        this.parentElement.remove();
    });
});
