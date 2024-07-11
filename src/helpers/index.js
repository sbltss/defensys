import moment from "moment";
import withoutInjuryIcon from "../assets/img/icons/withoutInjury.png";
import withInjuryIcon from "../assets/img/icons/withInjury.png";
// import geojson from "../assets/map/taguigMapPolygons.json";

export const getFilters = (array, key, getDescFunc) => {
  let filters = [];
  array.forEach((a) => {
    if (!filters.includes(a[key])) filters.push(a[key]);
  });
  if (getDescFunc)
    return filters.map((f) => ({
      text: getDescFunc(f),
      value: f,
    }));
  else return filters.map((f) => ({ text: f, value: f }));
};

export const getCaseTypeName = (id, types, key) => {
  if (id === "-1") return "Pending Information";
  return (
    types?.filter((ct) => {
      return +ct.id === +id;
    })[0]?.[key] || ""
  );
};

export const formatData = (tickets, caseTypes, geoJson) => {
  let today = 0;
  let week = 0;
  let month = 0;
  let year = 0;
  let todayResolved = 0;
  let weekResolved = 0;
  let monthResolved = 0;
  let yearResolved = 0;
  let pending = 0;
  let ongoing = 0;
  let resolved = 0;
  let ticketsByCaseTypes = {};
  let total = 0;
  let withInjury = 0;
  let withoutInjury = 0;
  let pastCasesByDate = {};
  let barangayValues;
  for (const ticket of tickets) {
    if (moment(ticket.dateCreated).isSame(moment(), "day")) {
      today++;
      week++;
      month++;
      year++;
      if (+ticket.status === 2) {
        todayResolved++;
        weekResolved++;
        monthResolved++;
        yearResolved++;
      }
    } else if (moment(ticket.dateCreated).isSame(moment(), "week")) {
      week++;
      month++;
      year++;
      if (+ticket.status === 2) {
        weekResolved++;
        monthResolved++;
        yearResolved++;
      }
    } else if (moment(ticket.dateCreated).isSame(moment(), "month")) {
      month++;
      year++;
      if (+ticket.status === 2) {
        monthResolved++;
        yearResolved++;
      }
    } else if (moment(ticket.dateCreated).isSame(moment(), "year")) {
      year++;
      if (+ticket.status === 2) {
        yearResolved++;
      }
    }
    if (moment(ticket.dateCreated).isSame(moment(), "day")) {
      if (+ticket.status === 0) {
        pending++;
      } else if (+ticket.status === 1) {
        ongoing++;
      } else if (+ticket.status === 2) {
        resolved++;
      }
    }
    if (ticketsByCaseTypes.hasOwnProperty(ticket.caseType))
      ticketsByCaseTypes[ticket.caseType]++;
    else ticketsByCaseTypes[ticket.caseType] = 1;

    if (+ticket.withInjury === 0) withoutInjury++;
    else withInjury++;
    total++;

    let unixTicketTime = moment(ticket.dateCreated).startOf("day").unix();
    if (pastCasesByDate.hasOwnProperty(unixTicketTime)) {
      if (pastCasesByDate[unixTicketTime].hasOwnProperty(ticket.caseType)) {
        pastCasesByDate[unixTicketTime][ticket.caseType]++;
      } else {
        pastCasesByDate[unixTicketTime][ticket.caseType] = 1;
      }
    } else {
      pastCasesByDate[unixTicketTime] = { [ticket.caseType]: 1 };
    }
  }
  ticketsByCaseTypes = Object.keys(ticketsByCaseTypes).map((key) => {
    return {
      name: getCaseTypeName(key, caseTypes, "typeName"),
      value: ticketsByCaseTypes[key],
    };
  });
  ticketsByCaseTypes = ticketsByCaseTypes?.sort((a, b) => {
    if (a.y < b.y) {
      return 1;
    }
    if (a.y > b.y) {
      return -1;
    }
    return 0;
  });
  barangayValues = getBarangayValues(tickets, caseTypes, geoJson)?.sort(
    (a, b) => {
      if (a.counts.total < b.counts.total) {
        return 1;
      }
      if (a.counts.total > b.counts.total) {
        return -1;
      }
      return 0;
    }
  );
  return {
    total,
    reportedCount: [
      { count: today, title: "Today" },
      { count: week, title: "This Week" },
      { count: month, title: "This Month" },
      { count: year, title: "This Year" },
    ],
    resolvedCount: [
      { count: todayResolved, title: "Today" },
      { count: weekResolved, title: "This Week" },
      { count: monthResolved, title: "This Month" },
      { count: yearResolved, title: "This Year" },
    ],
    overallTickets: {
      pending,
      ongoing,
      resolved,
    },
    ticketsByCaseTypes,
    withInjuryCount: {
      icon: withInjuryIcon,
      count: withInjury,
      rate: ((withInjury / (withInjury + withoutInjury)) * 100).toFixed(2),
    },
    withoutInjuryCount: {
      icon: withoutInjuryIcon,
      count: withoutInjury,
      rate: ((withoutInjury / (withInjury + withoutInjury)) * 100).toFixed(2),
    },

    pastCasesByDate: Object.entries(pastCasesByDate),
    barangayValues,
  };
};

export const getBarangayValues = (tickets, caseTypes, geoJson) => {
  const polygons = geoJson?.features.map((feature) => ({
    poly: new window.google.maps.Polygon({
      paths: feature.geometry.coordinates[0].map((d) => ({
        lat: d[1],
        lng: d[0],
      })),
    }),
    properties: feature.properties,
  }));
  let barangayValues = polygons?.map((polygon) => {
    let counts = { total: 0 };
    caseTypes?.forEach((ct) => {
      counts[ct.id] = 0;
    });
    tickets.forEach((ticket) => {
      let coords = { lng: +ticket.longitude, lat: +ticket.latitude };
      if (
        window.google.maps.geometry.poly.containsLocation(coords, polygon.poly)
      ) {
        caseTypes?.forEach((ct) => {
          if (+ticket.caseType === +ct.id) counts[ct.id]++;
        });
        counts.total++;
      }
    });
    if (+counts.total !== 0) {
      return {
        counts,
        brgyName: polygon.properties.ADM4_EN,
      };
    } else {
      return null;
    }
  });
  return (barangayValues = barangayValues?.filter((bv) => {
    return bv != null;
  }));
};

export const truncateString = (string, n) => {
  return string?.length > n ? string.substring(0, n - 1) + "..." : string;
};

export const getUniqueUsherBldg = (ushers) => {
  const arr = [];
  return ushers.filter((u) => {
    if (!arr.includes(u.bldg_id)) {
      arr.push(u.bldg_id);
      return true;
    }
    return false;
  });
};

export const getReportCategory = (
  reportCategoryId,
  reportCategoryDesc,
  reportCategories
) => {
  const result = [];
  const selected =
    reportCategories.filter((rc) => rc.subCategoryId === reportCategoryId)[0] ||
    {};
  if (selected.title) result.push(selected.title);
  const selected2 =
    reportCategories.filter(
      (rc) => rc.subCategoryId === selected.categoryId
    )[0] || {};
  // if (selected2.title) result.push(selected2.title);
  if (reportCategoryDesc?.length > 0) result.push(reportCategoryDesc);
  return result.join(" - ");
};
export const colors = [
  "#00ff00",
  "#02fd00",
  "#05fa00",
  "#07f800",
  "#0af500",
  "#0cf300",
  "#0ff000",
  "#12ed00",
  "#14eb00",
  "#17e800",
  "#19e600",
  "#1ce300",
  "#1ee100",
  "#21de00",
  "#24db00",
  "#26d900",
  "#29d600",
  "#2bd400",
  "#2ed100",
  "#30cf00",
  "#33cc00",
  "#36c900",
  "#38c700",
  "#3bc400",
  "#3dc200",
  "#40bf00",
  "#42bd00",
  "#45ba00",
  "#48b700",
  "#4ab500",
  "#4db200",
  "#4fb000",
  "#52ad00",
  "#55aa00",
  "#57a800",
  "#5aa500",
  "#5ca300",
  "#5fa000",
  "#619e00",
  "#649b00",
  "#679800",
  "#699600",
  "#6c9300",
  "#6e9100",
  "#718e00",
  "#738c00",
  "#768900",
  "#798600",
  "#7b8400",
  "#7e8100",
  "#807f00",
  "#837c00",
  "#857a00",
  "#887700",
  "#8b7400",
  "#8d7200",
  "#906f00",
  "#926d00",
  "#956a00",
  "#976800",
  "#9a6500",
  "#9d6200",
  "#9f6000",
  "#a25d00",
  "#a45b00",
  "#a75800",
  "#aa5500",
  "#ac5300",
  "#af5000",
  "#b14e00",
  "#b44b00",
  "#b64900",
  "#b94600",
  "#bc4300",
  "#be4100",
  "#c13e00",
  "#c33c00",
  "#c63900",
  "#c83700",
  "#cb3400",
  "#ce3100",
  "#d02f00",
  "#d32c00",
  "#d52a00",
  "#d82700",
  "#da2500",
  "#dd2200",
  "#e01f00",
  "#e21d00",
  "#e51a00",
  "#e71800",
  "#ea1500",
  "#ec1300",
  "#ef1000",
  "#f20d00",
  "#f40b00",
  "#f70800",
  "#f90600",
  "#fc0300",
  "#ff0000",
];
