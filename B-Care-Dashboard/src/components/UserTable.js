// src/components/UserTable.js - Enhanced User Table with Better UI
import React, { useState, useMemo } from "react";
import { API_BASE } from "../config";
import "./UserTable.css";

const Icons = {
  User: () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
    </svg>
  ),
  Phone: () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
    </svg>
  ),
  View: () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{ width: "18px", height: "18px" }}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  Info: () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{ width: "18px", height: "18px" }}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
    </svg>
  ),
  Delete: () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{ width: "18px", height: "18px" }}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
    </svg>
  ),
  New: () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{ width: "12px", height: "12px" }}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
    </svg>
  ),
  Check: () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{ width: "14px", height: "14px" }}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
    </svg>
  ),
  Alert: () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{ width: "14px", height: "14px" }}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
    </svg>
  ),
  Circle: () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{ width: "14px", height: "14px" }}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  Card: () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
    </svg>
  ),
};

export default function UserTable({
  users,
  highlightIp,
  cardIp,
  onShowCard,
  onShowInfo,
}) {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [filterStatus, setFilterStatus] = useState("all");

  const handleDelete = async (ip) => {
    if (!window.confirm(`هل أنت متأكد من حذف جميع بيانات ${ip}؟`)) return;

    const token = localStorage.getItem("token");
    try {
      const res = await fetch(
        `${API_BASE}/api/users/${encodeURIComponent(ip)}`,
        {
          method: "DELETE",
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      if (!res.ok) {
        throw new Error(`Server responded ${res.status}: ${res.statusText}`);
      }
    } catch (err) {
      console.error("Delete failed:", err);
      alert("فشل الحذف: " + err.message);
    }
  };

  const usersArray = useMemo(() => {
    let arr = Array.isArray(users) ? users : Object.entries(users);

    // Apply filter
    if (filterStatus !== "all") {
      arr = arr.filter(([ip, user]) => {
        if (filterStatus === "online") return user.currentPage && user.currentPage !== "offline";
        if (filterStatus === "offline") return !user.currentPage || user.currentPage === "offline";
        if (filterStatus === "new") return user.hasNewData;
        if (filterStatus === "paid") return user.hasPayment;
        if (filterStatus === "flagged") return user.flag;
        return true;
      });
    }

    // Apply sorting
    if (sortConfig.key) {
      arr.sort((a, b) => {
        const aVal = a[1]?.[sortConfig.key] || a[1] || "";
        const bVal = b[1]?.[sortConfig.key] || b[1] || "";

        if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }

    return arr;
  }, [users, sortConfig, filterStatus]);

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return "↕";
    return sortConfig.direction === "asc" ? "↑" : "↓";
  };

  const isOnline = (u) => u.currentPage && u.currentPage !== "offline";

  const getStatusBadge = (user) => {
    if (user.hasPayment) {
      return (
        <span className="status-badge paid">
          <Icons.Check />
          مدفوع
        </span>
      );
    }
    if (user.hasNewData) {
      return (
        <span className="status-badge new">
          <Icons.Alert />
          جديد
        </span>
      );
    }
    if (isOnline(user)) {
      return (
        <span className="status-badge online">
          <span className="status-dot online"></span>
          متصل
        </span>
      );
    }
    return (
      <span className="status-badge offline">
        غير متصل
      </span>
    );
  };

  const getPageBadge = (page) => {
    if (!page || page === "offline") return null;
    const pageName = page.replace(".html", "").replace(/([A-Z])/g, " $1").trim();
    return <span className="page-badge">{pageName}</span>;
  };

  const getUserDisplayName = (user) => {
    if (user.name) return user.name;
    if (user.customerName) return user.customerName;
    if (user.FullName) return user.FullName;
    return "مستخدم جديد";
  };

  return (
    <>
      <div className="table-actions" style={{ padding: "0 20px 15px", display: "flex", gap: "12px", flexWrap: "wrap" }}>
        <select 
          className="filter-select" 
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          style={{ minWidth: "180px" }}
        >
          <option value="all">جميع المستخدمين</option>
          <option value="online">المتصلين فقط</option>
          <option value="offline">غير المتصلين</option>
          <option value="new">الطلبات الجديدة</option>
          <option value="paid">المكتملة</option>
          <option value="flagged">المعلمين</option>
        </select>
      </div>

      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th onClick={() => handleSort("name")} style={{ cursor: "pointer" }}>
                المستخدم {getSortIcon("name")}
              </th>
              <th onClick={() => handleSort("nationalID")} style={{ cursor: "pointer" }}>
                رقم الهوية {getSortIcon("nationalID")}
              </th>
              <th>رقم الهاتف</th>
              <th onClick={() => handleSort("currentPage")} style={{ cursor: "pointer" }}>
                الصفحة الحالية {getSortIcon("currentPage")}
              </th>
              <th>الحالة</th>
              <th>الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {usersArray.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: "center", padding: "3rem", color: "#64748b" }}>
                  <div className="empty-state" style={{ padding: "2rem" }}>
                    <Icons.User />
                    <h4>لا توجد بيانات</h4>
                    <p>لم يتم العثور على مستخدمين</p>
                  </div>
                </td>
              </tr>
            ) : (
              usersArray.map(([ip, user]) => {
                const isHighlighted = ip === highlightIp || ip === cardIp;
                
                // تحديد فئة الصف بناءً على الحالة
                let rowClass = '';
                if (user.hasNewData) {
                  rowClass = 'new-message-row';
                } else if (user.hasPayment) {
                  rowClass = 'paid-row';
                } else if (user.flag) {
                  rowClass = 'flagged-row';
                }
                
                if (isHighlighted) {
                  rowClass += ' highlighted-row';
                }

                return (
                  <tr key={ip} className={rowClass.trim()}>
                    <td data-label="المستخدم">
                      <div className="user-cell">
                        <div className="user-avatar-small">
                          <Icons.User />
                        </div>
                        <div className="user-info">
                          <span className={`user-name ${user.hasNewData ? "new-indicator" : ""}`}>
                            {getUserDisplayName(user)}
                            {user.hasNewData && (
                              <span className="new-badge">
                                <Icons.New /> جديد
                              </span>
                            )}
                          </span>
                          <span className="user-ip">{ip}</span>
                        </div>
                      </div>
                    </td>
                    <td data-label="رقم الهوية">
                      {user.nationalID || user.IDorResidenceNumber || user.nid || "—"}
                    </td>
                    <td data-label="رقم الهاتف">
                      <div className="phone-cell">
                        <Icons.Phone />
                        <span>{user.phoneNumber || "—"}</span>
                      </div>
                    </td>
                    <td data-label="الصفحة الحالية">
                      {getPageBadge(user.currentPage)}
                    </td>
                    <td data-label="الحالة">
                      {getStatusBadge(user)}
                    </td>
                    <td data-label="الإجراءات">
                      <div className="action-buttons">
                        <button
                          className="action-btn view"
                          onClick={() => onShowCard(ip)}
                          title="عرض التفاصيل"
                        >
                          <Icons.Card />
                        </button>
                        <button
                          className="action-btn"
                          onClick={() => onShowInfo(ip)}
                          title="المعلومات"
                        >
                          <Icons.Info />
                        </button>
                        <button
                          className="action-btn delete"
                          onClick={() => handleDelete(ip)}
                          title="حذف"
                        >
                          <Icons.Delete />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
