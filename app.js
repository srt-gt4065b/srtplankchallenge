
const today = new Date();
document.getElementById("today").innerText =
  today.toISOString().split("T")[0];

let participants = {};

fetch("participants.json")
  .then(r=>r.json())
  .then(data=>{
     participants = data;
     renderPanel();
     applyLights();
  });

function renderPanel(){
   const panel=document.getElementById("participant-panel");
   panel.innerHTML="";
   Object.keys(participants).forEach(id=>{
      const p=participants[id];
      const btn=document.createElement("div");
      btn.className="p-btn";
      btn.id="p-"+id;
      btn.innerHTML = p.name + '<span class="indicator">○</span>';
      panel.appendChild(btn);
   });
}

function submitCheckin(){
    const userId=document.getElementById("userId").value;
    const name=document.getElementById("name").value;
    const msg=document.getElementById("msg").value;

    const dateKey = today.toISOString().split("T")[0];
    const ref=db.ref("checkins/"+dateKey).push();
    ref.set({
      userId,
      name,
      msg,
      time: new Date().toLocaleTimeString("ko-KR",{hour:"2-digit",minute:"2-digit"})
    });
}

function applyLights(){
    const dateKey=today.toISOString().split("T")[0];

    db.ref("checkins/"+dateKey).on("value",snap=>{
        Object.keys(participants).forEach(id=>{
            const btn=document.getElementById("p-"+id);
            if(btn){
              btn.classList.remove("on");
              btn.querySelector(".indicator").innerText="○";
            }
        });

        snap.forEach(child=>{
            const d=child.val();
            const btn=document.getElementById("p-"+d.userId);
            if(btn){
              btn.classList.add("on");
              btn.querySelector(".indicator").innerText="●";
            }
        });
    });
}
