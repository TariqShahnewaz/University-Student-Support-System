function showMessage(text) {
    let message = document.getElementById("message");
    message.innerText = text;
    message.classList.add("show");

    setTimeout(function () {
        message.classList.remove("show");
    }, 2500);
}

let reportForm = document.getElementById("reportForm");

if (reportForm) {
    reportForm.addEventListener("submit", function (event) {
        event.preventDefault();

        let title = document.getElementById("title").value;
        let category = document.getElementById("category").value;
        let location = document.getElementById("location").value;
        let description = document.getElementById("description").value;

        if (title === "" || category === "" || location === "" || description === "") {
            showMessage("Please fill in all required fields");
            return;
        }

        showMessage("Report submitted successfully");
        reportForm.reset();
    });
}
