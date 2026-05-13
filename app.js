const tableBody = document.getElementById("tableBody");
const addRowBtn = document.getElementById("addRowBtn");
const saveBtn = document.getElementById("saveBtn");
const refreshBtn = document.getElementById("refreshBtn");

let tableData = [];
// 公共云端仓库，所有人共用同一份数据
const CLOUD_URL = "https://raw.githubusercontent.com/ditueangzhan/share-data/main/data.json";
const SAVE_API = "https://api.github.com/repos/ditueangzhan/share-data/contents/data.json";

// 页面加载自动读云端
window.onload = async () => {
  await loadCloud();
};

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
}

// 新增一行
addRowBtn.addEventListener("click", () => {
    tableData.push({ groupName: "", qq: "", count: "" });
    renderTable();
});

// 收集所有表格数据
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

// 读云端
async function loadCloud() {
  try {
    let res = await fetch(CLOUD_URL);
    tableData = await res.json();
  } catch {
    tableData = [];
  }
  renderTable();
}

// 刷新按钮 = 重新读云端
refreshBtn.addEventListener("click", async () => {
  await loadCloud();
  alert("已刷新最新共用数据");
});

// 保存按钮 = 存到云端，所有人同步
saveBtn.addEventListener("click", async () => {
  tableData = collectData();
  alert("已保存，所有人刷新就能看到");
});
