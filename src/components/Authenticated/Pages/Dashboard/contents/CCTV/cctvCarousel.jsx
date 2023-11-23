const modules = ["cctvdiv", "eridiv", "weatherdiv", "sosdiv"];
let CCTVPROPS = {
  ip: "192.168.2.61",
  // ip: "192.168.3.52",
  encryptedip: document.getElementById("encryptedcctvIP").value,
  port: document.getElementById("cctvPORT").value,
  username: document.getElementById("cctvUSERNAME").value,
  password: document.getElementById("cctvPASSWORD").value,
  protocol: document.getElementById("cctvPROTOCOL").value, //http:1, https:2,
  heigth: 576,
  width: 704,
  deviceIdentity: document.getElementById("cctvDEVICEIDENTIFY").value,
};
$("");
document.getElementById("cctv-credentials").remove();

let playbackInterval = null;

$(`.canhide`).css({ display: "none" });
$('.cardmodule[moduleType="eridiv"] .map').css({ display: "none" });

var iRet = WebVideoCtrl.I_CheckPluginInstall();
if (-1 == iRet) {
  alert(
    "If the plugin is uninstalled, please install the WebComponentsKit.exe!"
  );
}
const initCctv = () => {
  try {
    WebVideoCtrl.I_Login(
      CCTVPROPS.ip,
      CCTVPROPS.protocol,
      CCTVPROPS.port,
      CCTVPROPS.username,
      CCTVPROPS.password,
      {
        success: function (xmlDoc) {
          setTimeout(function () {
            getChannelInfo();
            getDevicePort();
          }, 10);
        },
        error: function (status, xmlDoc) {
          throw "login failed";
        },
      },

      CCTVPROPS.ip
    );
  } catch (err) {
    console.log(err);
  }
};

const getDevicePort = () => {
  CCTVPROPS.port = WebVideoCtrl.I_GetDevicePort(CCTVPROPS.ip);
};

const getChannelInfo = () => {
  let flag = false;
  // try {
  WebVideoCtrl.I_GetAnalogChannelInfo(CCTVPROPS.ip, {
    async: false,
    success: function (xmlDoc) {
      var oChannels = $(xmlDoc).find("VideoInputChannel");
      let indexZeroFlag = true;
      $.each(oChannels, function (i) {
        // if (!flag) {
        var id = $(this).find("id").eq(0).text(),
          name = $(this).find("name").eq(0).text();
        if ("" == name) {
          name = "Camera " + (i < 9 ? "0" + (i + 1) : i + 1);
        }
        $(".carousel-inner").append(
          `
                <div class="carousel-item ${
                  indexZeroFlag ? "active" : ""
                }" cctvid="${id}">
                    <img src="/public/img/loading.gif" class="carousel-img d-block w-100" alt="${name}">
                    <div class="carousel-item__name">${name}</div>
                </div>
            `
        );
        indexZeroFlag = false;
        //   $("#cameraSelect").append(
        //     "<option value='" + id + "' bZero='false'>" + name + "</option>"
        //   );
        // flag = true;
        // }
      });
    },
    error: function (status, xmlDoc) {
      throw "Get analog channel failed";
    },
  });
  // } catch (err) {}

  WebVideoCtrl.I_GetDigitalChannelInfo(CCTVPROPS.deviceIdentity, {
    async: false,
    success: function (xmlDoc) {
      var oChannels = $(xmlDoc).find("InputProxyChannelStatus");

      $.each(oChannels, function (i) {
        var id = $(this).find("id").eq(0).text(),
          name = $(this).find("name").eq(0).text(),
          online = $(this).find("online").eq(0).text();
        if ("false" == online) {
          // filter the forbidden IP channel
          return true;
        }
        if ("" == name) {
          name = "IPCamera " + (i < 9 ? "0" + (i + 1) : i + 1);
        }
        $(".carousel-inner").append(
          `
                <div class="carousel-item ${
                  flag ? "" : "active"
                }" cctvid="${id}">
                    <img src="/public/img/loading.gif" class="carousel-img d-block w-100" alt="${name}">
                    <div class="carousel-item__name">${name}</div>
                </div>
            `
        );

        flag = true;
        //   $("#cameraSelect").append(
        //     "<option value='" + id + "' bZero='false'>" + name + "</option>"
        //   );
      });
    },
    error: function (status, xmlDoc) {
      throw "Get digital channel failed";
    },
  });

  setCctv();
};
const deviceCapture = (channelId) => {
  if (playbackInterval) clearInterval(playbackInterval);
  let callback = (s) => {
    playbackInterval = setInterval(() => {
      if ($('.cardmodule[moduleType="cctvdiv"]').css("display") != "none")
        $(`.carousel-item[cctvid="${channelId}"] img`).attr(
          "src",
          s + "?t=" + new Date().getTime()
        );
    }, 300);
  };
  var iResolutionWidth = parseInt($("#resolutionWidth").val(), 10);
  var iResolutionHeight = parseInt($("#resolutionHeight").val(), 10);

  var iRet = WebVideoCtrl.I_DeviceCapturePic(
    CCTVPROPS.ip,
    channelId,
    null,
    {
      iResolutionWidth: CCTVPROPS.width,
      iResolutionHeight: CCTVPROPS.heigth,
    },
    callback
  );

  if (0 == iRet) {
    szInfo = "device capturing succeed!";
  } else {
    szInfo = "device capturing failed!";
  }
};

$("#cameraSelect").change((e) => {
  if (e.target.value != "") return deviceCapture(e.target.value);
  $("#cameraImg").attr("src", "");
});

initCctv();

//////////////////////////////
// let myCarousel = document.querySelector("#cctvCarousel");
// let carousel = new bootstrap.Carousel(myCarousel, {
//   interval: 10000,
// });
// $(".carousel-control-prev").click(() => {
//   carousel.prev();
// });
// $(".carousel-control-next").click(() => {
//   carousel.next();
// });
// myCarousel.addEventListener("slid.bs.carousel", (e) => {
//   setCctv();
// });

const setCctv = () => {
  clearInterval(playbackInterval);
  let cctvId = $(".carousel-item.active").attr("cctvId");
  if (cctvId != "") return deviceCapture(cctvId);
  $("#cameraImg").attr("src", "");
};

$(".cardmodule").click((e) => {
  const module = $($(e.currentTarget)[0]).attr("moduleType");
  $(`button.back`).css({ display: "block" });
  $(`.canhide`).css({ display: "" });

  setTimeout(() => {
    typeOfCasesChart?.reflow();
    casesPerBarangayChart?.reflow();
    reportedCasesChart?.reflow();
  }, 260);

  modules.forEach((m) => {
    if (m === module) {
      $(`.cardmodule[moduleType="${m}"]`).css({
        display: "block",
      });
      $(`.cardmodule[moduleType="${m}"]`).children("div.card").css({
        height: "calc((100vh - 150px))",
      });
      if (m != "sosdiv")
        $(`.cardmodule[moduleType="${m}"]`)
          .removeClass("col-lg-6")
          .addClass("col-lg-12");

      $(`.displaycard`).removeClass("expandable");

      return;
    }

    $(`.cardmodule[moduleType="${m}"]`).css({
      display: "none",
    });

    if (m != "sosdiv")
      $(`.cardmodule[moduleType="${m}"]`)
        .removeClass("col-lg-12")
        .addClass("col-lg-6");
  });
  if (module === "eridiv") {
    $('.cardmodule[moduleType="eridiv"] .events').addClass("col-4");
    $('.cardmodule[moduleType="eridiv"] .events').removeClass("col-12");
    $('.cardmodule[moduleType="eridiv"] .map').css({ display: "block" });
    $(".recent-events").css({ height: "90%" });
  }
  // $(".defaultcol4").removeClass("col-lg-4");
  // $(".defaultcol4").addClass("col-lg-4");
  // $(".defaultcol5").removeClass("col-lg-5");
  // $(".defaultcol5").addClass("col-lg-5");
});
$(`button.back`).click(() => {
  // $(".defaultcol4").addClass("col-lg-4");
  // $(".defaultcol4").removeClass("col-lg-4");
  // $(".defaultcol5").addClass("col-lg-5");
  // $(".defaultcol5").removeClass("col-lg-5");
  $(`.displaycard`).addClass("expandable");
  $(`button.back`).css({ display: "none" });
  $(`.canhide`).css({ display: "none" });

  $('.cardmodule[moduleType="eridiv"] .events').addClass("col-12");
  $('.cardmodule[moduleType="eridiv"] .events').removeClass("col-4");
  $('.cardmodule[moduleType="eridiv"] .map').css({ display: "none" });
  $(".recent-events").css({ height: "85%" });
  setTimeout(() => {
    typeOfCasesChart?.reflow();
    casesPerBarangayChart?.reflow();
    reportedCasesChart?.reflow();
  }, 260);

  modules.forEach((m) => {
    $(`.cardmodule[moduleType="${m}"]`).css({
      display: "block",
    });
    if (m != "sosdiv") {
      $(`.cardmodule[moduleType="${m}"]`).children("div.card").css({
        height: "calc((100vh - 150px)/2)",
      });
    } else {
      $(`.cardmodule[moduleType="${m}"]`).children("div.card").css({
        height: "fit-content",
      });
    }
    if (m != "sosdiv")
      $(`.cardmodule[moduleType="${m}"]`)
        .removeClass("col-lg-12")
        .addClass("col-lg-6");
  });
});
