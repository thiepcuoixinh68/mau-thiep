/* ===== CẤU HÌNH CỬA HÀNG ===== */
const SHOP = {
  name: "Thiệp Cưới Linh Anh",
  zalo: "0985718237",            // số Zalo
  phone: "0985718237",
  address: "Số 3, ngách 76, ngõ 29 Phố Trạm, Long Biên, Hà Nội",
  logo: "images/avatar-linh-anh.png",// logo: bỏ file vào images/ rồi ghi đường dẫn, ví dụ "images/logo.png". Để "" thì hiện chữ tên cửa hàng
  showName: true,
  tagOrder: ["Hồng","Xanh dương","Xanh lá","Hoa dại","Kem","Thiệp HD","Thiệp HT","Thiệp TP","Thiêp TV"],  // thứ tự các nhóm ở nút lọc. Đổi chữ ở đây VÀ ở dòng mẫu để đổi tên nhóm
  // LOẠI GIẤY và BẢNG GIÁ CHUNG theo số lượng. Mỗi mức: [từ bao nhiêu thiệp trở lên, giá 1 thiệp]
  // (các mức giá dưới đây là SỐ MẪU để chạy thử, hãy thay bằng giá thật của bạn)
  // Chỉ có 1 loại giấy thì xóa dòng còn lại, ô chọn giấy sẽ tự ẩn.
  papers: [
    {name:"Giấy thường", tiers:[[100,2000],[200,1800],[300,1700],[400,1600],[500,1500]]},
    {name:"Giấy ánh kim", tiers:[[100,2200],[200,2000],[300,1900],[400,1800],[500,1700]]}
  ],
  defaultQty: 100,               // số lượng mặc định
  defaultDesc: "Chọn loại giấy và số lượng để xem giá ngay bên dưới.",  // hiện khi mẫu không có desc riêng
  perks: [["🚚","Giao toàn quốc"],["🎨","Thiết kế miễn phí"],["✨","In test trước"]]
};

/* ===== DANH SÁCH MẪU THIỆP =====
   Muốn THÊM mẫu: copy 1 dòng {...} rồi dán thêm, nhớ có dấu phẩy cuối dòng.
   Muốn SỬA tên/giá/nhóm: sửa chữ trong dòng đó.
   Muốn XÓA mẫu: xóa cả dòng.
   Muốn thêm CHỮ GIỚI THIỆU CHI TIẾT cho mẫu: thêm  detail:["Đoạn 1","- Ý gạch đầu dòng","- Ý khác","Đoạn 2"]
   (mỗi phần trong ngoặc kép là 1 dòng; dòng bắt đầu bằng "- " sẽ thành gạch đầu dòng; các dòng cách nhau bằng dấu phẩy)
   Muốn mẫu nào có GIÁ RIÊNG: thêm  papers:[{name:"Giấy thường",tiers:[[100,3000],[200,2600]]},{name:"Giấy ánh kim",tiers:[[100,4000],[200,3500]]}]
   (mẫu không có papers thì dùng bảng giá chung ở SHOP.papers)
   img: ảnh chính trong thư mục images/
   imgs: (không bắt buộc) nhiều ảnh chi tiết, ví dụ imgs:["images/a.jpg","images/b.jpg"] */
const TEMPLATES = [
  {id:"TC001", name:"Thiệp hồng hoa cam tím có ảnh cưới", tag:"Hồng",     img:"images/tc001.jpg", desc:"",
   detail:["Thiệp gấp ba, viền cắt theo hình hoa.","- Khung ảnh cưới ở mặt trong","- Có phần Timeline và Dresscode","- Kèm thiệp Save the Date"]},
  {id:"TC002", name:"Thiệp trắng dập nổi hoa mẫu đơn nơ đỏ", tag:"Xanh lá", img:"images/tc002.jpg", desc:""},
  {id:"TC003", name:"Thiệp trắng hoa dại xanh bơ",        tag:"Hoa dại",  img:"images/tc003.jpg", desc:"", imgs:["images/tc003.jpg","images/tc004.jpg"]},
  {id:"TC004", name:"Thiệp trắng hoa dại phong bì nơ xanh rêu", tag:"Hoa dại", img:"images/tc004.jpg", desc:"", imgs:["images/tc004.jpg","images/tc003.jpg"]},
  {id:"TC005", name:"Thiệp trắng viền xanh nơ dương hoa dại", tag:"Xanh dương", img:"images/tc005.jpg", desc:"", imgs:["images/tc005.jpg","images/tc008.jpg"]},
  {id:"TC006", name:"Thiệp kem dập nổi hoa linh lan chữ ký hiệu đôi", tag:"Kem", img:"images/tc006.jpg", desc:""},
  {id:"TC007", name:"Thiệp trắng kem hoa tulip nét vẽ huy hiệu", tag:"Kem", img:"images/tc007.jpg", desc:""},
  {id:"TC008", name:"Thiệp xanh dương nơ có ảnh cưới", tag:"Xanh dương", img:"images/tc008.jpg", desc:"", imgs:["images/tc008.jpg","images/tc005.jpg"]},
  {id:"TC009", name:"Thiệp trắng dập nổi cánh quạt hoa văn nét vẽ", tag:"Kem", img:"images/tc009.jpg", desc:""}
];


/* ===== PHẦN DƯỚI NÀY KHÔNG CẦN SỬA ===== */
const money = n => Number(n).toLocaleString("vi-VN");
const papersOf = t => {
  const first = (SHOP.papers && SHOP.papers[0]) ? SHOP.papers[0].name : "Giấy thường";
  const P = t.papers || (t.tiers ? [{name:first, tiers:t.tiers}] : (SHOP.papers || [{name:"Giấy thường", tiers:SHOP.tiers}]));
  return P.map(p => ({name:p.name, tiers:p.tiers.slice().sort((a,b)=>a[0]-b[0])}));
};
const minQty = t => Math.min(...papersOf(t).map(p => p.tiers[0][0]));
const fromPrice = t => Math.min(...papersOf(t).flatMap(p => p.tiers.map(x => x[1])));
function priceFor(t,q,pi){        // trả null nếu thấp hơn số lượng tối thiểu của loại giấy đó
  const P=papersOf(t), p=P[pi||0]||P[0]; let r=null; p.tiers.forEach(x=>{ if(q>=x[0]) r=x[1] }); return r;
}
function tierRows(t,pi){          // dòng hiển thị bảng giá của loại giấy đang chọn
  const P=papersOf(t), a=(P[pi||0]||P[0]).tiers;
  return a.map((x,i)=>[ i<a.length-1 ? x[0]+" – "+(a[i+1][0]-1)+" thiệp" : "Từ "+x[0]+" thiệp trở lên", x[1] ]);
}
function setLogo(){
  const e=document.querySelector("#shop"); e.textContent="";
  e.style.display="flex"; e.style.alignItems="center"; e.style.gap="10px";
  if(SHOP.logo){
    const i=new Image(); i.src=SHOP.logo; i.alt=SHOP.name; i.style.height="38px"; i.style.display="block";
    i.onerror=()=>{ i.remove(); if(!SHOP.showName) e.textContent=SHOP.name; };
    e.appendChild(i);
    if(SHOP.showName){ const s=document.createElement("span"); s.textContent=SHOP.name; e.appendChild(s); }
  } else e.textContent=SHOP.name;
}
