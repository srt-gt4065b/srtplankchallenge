
const today = new Date();
document.getElementById("today").innerText =
  today.toISOString().split("T")[0];

let participants = {};

fetch("participants.json")
  .then(r => r.json())
  .then(data => {
     participants = data;
     renderPanel();
     applyLights();
     markYesterdayMissed();
  });

function renderPanel(){
   const panel=document.getElementById("participant-panel");
   panel.innerHTML="";
   Object.keys(participants).forEach(id=>{
      const p=participants[id];
      const btn=document.createElement("div");
      btn.className="p-btn";
      btn.id="p-"+id;
      btn.innerHTML = `
          <span class="pid">${id}</span>
          ${p.name}
          <span class="indicator">○</span>
      `;
      panel.appendChild(btn);
   });
}

function submitCheckin(){
    const userId=document.getElementById("userId").value;
    const msg=document.getElementById("msg").value;

    if(!userId || !msg){
        alert("고유번호와 메시지를 입력해주세요!");
        return;
    }

    const dateKey = today.toISOString().split("T")[0];
    const ref=db.ref("checkins/"+dateKey).push();
    ref.set({
      userId,
      msg,
      time: new Date().toLocaleTimeString("ko-KR",{hour:"2-digit",minute:"2-digit"})
    });

    document.getElementById("userId").value="";
    document.getElementById("msg").value="";
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

function getYesterdayKey(){
    const d=new Date();
    d.setDate(d.getDate()-1);
    return d.toISOString().split("T")[0];
}

function markYesterdayMissed(){
    const yesterday=getYesterdayKey();

    db.ref("checkins/"+yesterday).once("value",snap=>{
        let checked=new Set();
        snap.forEach(child=> checked.add(String(child.val().userId)));

        Object.keys(participants).forEach(id=>{
            const btn=document.getElementById("p-"+id);
            if(!btn) return;
            if(!checked.has(String(id))){
                btn.classList.add("pink-miss");
            }
        });
    });
}
