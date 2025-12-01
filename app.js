const today = new Date();
document.getElementById("today").innerText =
  today.getFullYear() + "." +
  String(today.getMonth()+1).padStart(2, "0") + "." +
  String(today.getDate()).padStart(2, "0");

function openForm() {
    document.getElementById("checkin-form").classList.remove("hidden");
}
function closeForm() {
    document.getElementById("checkin-form").classList.add("hidden");
}

const colors = ["mint", "blue", "purple", "orange", "pink"];

function submitCheckin() {
    const name = document.getElementById("name").value.trim();
    const msg = document.getElementById("msg").value.trim();
    if (!name || !msg) {
        alert("이름과 메시지를 입력하세요!");
        return;
    }

    const dateKey = today.toISOString().split("T")[0];
    const newRef = db.ref("checkins/" + dateKey).push();

    newRef.set({
        name,
        msg,
        time: new Date().toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" }),
        color: colors[Math.floor(Math.random() * colors.length)]
    });

    document.getElementById("name").value = "";
    document.getElementById("msg").value = "";
    closeForm();
}

function loadCheckins() {
    const dateKey = today.toISOString().split("T")[0];

    db.ref("checkins/" + dateKey).on("value", snapshot => {
        const list = document.getElementById("checkin-list");
        list.innerHTML = "";

        snapshot.forEach(child => {
            const data = child.val();

            const card = document.createElement("div");
            card.className = "card " + data.color;

            card.innerHTML = `
                <div class="name">${data.name}</div>
                <div class="msg">${data.msg}</div>
                <div class="time">${data.time}</div>
            `;

            list.prepend(card);
        });
    });
}

loadCheckins();
