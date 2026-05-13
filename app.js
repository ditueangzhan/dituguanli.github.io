// ==============================================
// 带登录权限版 → 游客/管理员/查看员 三种权限
// ==============================================
const tableBody = document.getElementById("tableBody");
const addRowBtn = document.getElementById("addRowBtn");
const saveBtn = document.getElementById("saveBtn");
const refreshBtn = document.getElementById("refreshBtn");

let tableData = [];
let userRole = null; // null=未登录 guest=游客 admin=管理员 viewer=只能导入查看

// 账号密码配置
const users = {
  "iosdtglbmm": { pwd: "bmm8989", role: "admin" },
  "gcxtckrsgl": { pwd: "gcgl8989", role: "viewer" }
};

// 页面先弹出登录框
window.onload = () => {
  login();
  loadLocalData();
};

// 登录逻辑
function login() {
  const choice = prompt("请选择登录方式：\n1. 管理员登录\n2. 查看员登录\n3. 游客浏览（只能看）", "3");
  if (choice === "1") {
    const user = prompt("请输入账号：");
    const pwd = prompt("请输入密码：");
    if (users[user] && users[user].pwd === pwd) {
      userRole = users[user].role;
      alert("登录成功！欢迎管理员");
    } else {
      alert("账号或密码错误，自动转为游客");
      userRole = "guest";
    }
  } else if (choice === "2") {
    const user = prompt("请输入账号：");
    const pwd = prompt("请输入密码：");
    if (users[user] && users[user].pwd === pwd) {
      userRole = "viewer";
      alert("登录成功！您可以导入和查看");
    } else {
      alert("账号或密码错误，自动转为游客");
      userRole = "guest";
    }
  } else {
    userRole = "guest";
    alert("游客模式：仅可查看、导入");
  }
  applyPermission();
  renderTable();
}

// 权限控制
function applyPermission() {
  if (userRole === "admin") {
    addRowBtn.style.display = "inline-block";
    saveBtn.style.display = "inline-block";
    setInputEdit(true);
  } else if (userRole === "viewer") {
    addRowBtn.style.display = "none";
    saveBtn.style.display = "none";
    setInputEdit(false);
  } else {
    addRowBtn.style.display = "none";
    saveBtn.style.display = "none";
    setInputEdit(false);
  }
}

// 设置输入框是否可编辑
function setInputEdit(canEdit) {
  document.querySelectorAll("input").forEach(i => {
    i.readOnly = !canEdit;
  });
}

// 读取本地数据
function loadLocalData() {
  const local = localStorage.getItem("playerTableData");
  tableData = local ? JSON.parse(local) : [];
  renderTable();
}

// 渲染表格
function renderTable() {
  tableBody.innerHTML = "";
  tableData.forEach((item, idx) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${idx + 1}</td>
      <td><input type="text" class="groupName" value="${item.groupName || ''}"></td>
      <td><input type="text" class="qq" value="${item.qq || ''}"></td>
      <td><input type="text" class="count" value="${item.count || ''}"></td>
    `;
    tableBody.appendChild(tr);
  });
  applyPermission();
}

// 新增行
addRowBtn.addEventListener("click", () => {
  if (userRole !== "admin") return;
  tableData.push({ groupName: "", qq: "", count: "" });
  renderTable();
});

// 收集数据
function collectData() {
  const arr = [];
  document.querySelectorAll("tbody tr").forEach(tr => {
    arr.push({
      groupName: tr.querySelector(".groupName").value.trim(),
      qq: tr.querySelector(".qq").value.trim(),
      count: tr.querySelector(".count").value.trim()
    });
  });
  return arr;
}

// 保存
saveBtn.addEventListener("click", () => {
  if (userRole !== "admin") return;
  tableData = collectData();
  localStorage.setItem("playerTableData", JSON.stringify(tableData));
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(tableData, null, 2));
  const a = document.createElement("a");
  a.href = dataStr;
  a.download = "playerTableData.json";
  a.click();
});

// 刷新/导入
refreshBtn.addEventListener("click", () => {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = ".json";
  input.onchange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        tableData = JSON.parse(ev.target.result);
        localStorage.setItem("playerTableData", JSON.stringify(tableData));
        renderTable();
        alert("导入成功");
      } catch {
        alert("格式错误");
      }
    };
    reader.readAsText(file);
  };
  input.click();
});
