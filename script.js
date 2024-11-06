const firebaseConfig = {
    apiKey: "AIzaSyC1M6LT2ufKJa7euDMX_m4Fa-mNR6y7Mok",
    authDomain: "datt-ptit.firebaseapp.com",
    projectId: "datt-ptit",
    storageBucket: "datt-ptit.firebasestorage.app",
    messagingSenderId: "462440279973",
    appId: "1:462440279973:web:a4c74f6cf7a0575fe8824c",
    measurementId: "G-T0XTK3EDX2",
};

// Khởi tạo Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// Hàm cập nhật trạng thái thiết bị (checkbox và hình ảnh)
function updateDeviceState(deviceID, toggleButtonId, state) {
    const deviceElement = document.getElementById(deviceID);
    const toggleButton = document.getElementById(toggleButtonId);

    // Cập nhật trạng thái của nút gạt
    toggleButton.checked = state;
    // Cập nhật hình ảnh tương ứng
    deviceElement.src = state ? "/assets/images/light_on.png" : "/assets/images/light_off.png";
}

// Hàm thay đổi trạng thái thiết bị trong Firebase
function changeDevice(path, newState) {
    const deviceRef = firebase.database().ref(path);
    deviceRef.set(newState)
        .then(() => {
            if (newState === true) {
                const audio = new Audio('assets/audio/warning.mp3'); // Đường dẫn đến file mp3 của bạn
                audio.play().catch((error) => {
                    console.error("Không thể phát âm thanh:", error);
                });
            }
            console.log('Trạng thái thiết bị đã được cập nhật');
        })
        .catch((error) => {
            console.error("Lỗi khi cập nhật trạng thái:", error);
        });
}

// Hàm lắng nghe thay đổi trạng thái thiết bị từ Firebase
function listenToDeviceChanges(deviceID, path, toggleButtonId) {
    const deviceRef = firebase.database().ref(path);

    deviceRef.on("value", (snapshot) => {
        const status = snapshot.val();
        // Cập nhật giao diện khi trạng thái thay đổi từ Firebase
        updateDeviceState(deviceID, toggleButtonId, status);
    });
}

// Gọi hàm lắng nghe cho các thiết bị
listenToDeviceChanges("light_image1", "devices/phongkhach", "toggle_button1");
listenToDeviceChanges("light_image2", "devices/phongngu", "toggle_button2");
listenToDeviceChanges("light_image3", "devices/phongbep", "toggle_button3");

// Gọi hàm thay đổi trạng thái khi người dùng nhấn toggle button
document.getElementById("toggle_button1").addEventListener("change", function () {
    const newState = this.checked;
    changeDevice("devices/phongkhach", newState);
});

document.getElementById("toggle_button2").addEventListener("change", function () {
    const newState = this.checked;
    changeDevice("devices/phongngu", newState);
});

document.getElementById("toggle_button3").addEventListener("change", function () {
    const newState = this.checked;
    changeDevice("devices/phongbep", newState);
});
var gas = 0;
var humi = 0;
var temp = 0;
let audio;
function listenDataSensor() {
    var humidityElement = document.getElementById("value2");
    var tempElement = document.getElementById("value1");
    const gasData = firebase.database().ref("sensor/gas");
    const humiData = firebase.database().ref("sensor/humi");
    const tempData = firebase.database().ref("sensor/temp");
    gasData.on("value", (snapshot) => {
        gas = snapshot.val();
        console.log("Dữ liệu gas:", gas);
        if (gas > 11.2) {
            if (!audio) { // Chỉ phát nếu chưa có âm thanh đang phát
                audio = new Audio('assets/audio/warning.mp3');
                audio.loop = true; // Phát lặp lại để cảnh báo liên tục
                audio.play().catch((error) => {
                    console.error("Không thể phát âm thanh:", error);
                });
            }
        } else {
            if (audio) { // Dừng âm thanh nếu có âm thanh đang phát
                audio.pause();
                audio.currentTime = 0; // Đặt lại thời gian phát về ban đầu
                audio = null; // Xóa tham chiếu để có thể phát lại khi vượt ngưỡng
            }
        }
    });
    humiData.on("value", (snapshot) => {
        humi = snapshot.val();
        humidityElement.innerText = humi;
    });
    tempData.on("value", (snapshot) => {
        temp = snapshot.val();
        tempElement.innerText = temp;
    });


}
listenDataSensor()


