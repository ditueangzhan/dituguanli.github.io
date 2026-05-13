// DOM 元素
const tableBody = document.getElementById("tableBody");
const addRowBtn = document.getElementById("addRowBtn");
const saveBtn = document.getElementById("saveBtn");
const refreshBtn = document.getElementById("refreshBtn");

// 数据存在浏览器本地
let tableData = [];

// 页面加载时读取本地数据
window.onload = () => {
    const localData = localStorage.getItem("playerTableData");
    if (localData) {
        tableData = JSON.parse(localData);
    } else {
        tableData = [];
    }
    renderTable();
};

// 渲染表格 + 自动序号
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
    tableData.push({
        groupName: "",
        qq: "",
        count: ""
    });
    renderTable();
});

// 收集表格数据
function collectData() {
    const rows = tableBody.querySelectorAll("tr");
    const arr = [];
    rows.forEach(tr => {
        const groupName = tr.querySelector(".groupName").value.trim();
        const qq = tr.querySelector(".qq").value.trim();
        const count = tr.querySelector(".count").value.trim();
        arr.push({ groupName, qq, count });
    });
    return arr;
}

// 保存到本地 + 导出文件
saveBtn.addEventListener("click", () => {
    tableData = collectData();
    // 1. 保存到浏览器本地存储
    localStorage.setItem("playerTableData", JSON.stringify(tableData));
    // 2. 生成并下载 JSON 文件，方便你发给别人同步
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(tableData, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "playerTableData.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    alert("✅ 数据已保存！JSON文件已自动下载，发给别人导入就能同步");
});

// 刷新读取（这里改成手动导入文件）
refreshBtn.addEventListener("click", () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const data = JSON.parse(event.target.result);
                tableData = data;
                localStorage.setItem("playerTableData", JSON.stringify(tableData));
                renderTable();
                alert("✅ 数据导入成功！");
            } catch (err) {
                alert("❌ 文件格式错误，请导入正确的JSON文件");
            }
        };
        reader.readAsText(file);
    };
    input.click();
});
