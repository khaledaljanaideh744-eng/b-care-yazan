// src/components/UserTable.js
import React from "react";
import { API_BASE } from "../config";

export default function UserTable({
  users,
  highlightIp,
  cardIp,
  onShowCard,
  onShowInfo,
}) {
  const handleDelete = async (ip) => {
    if (!window.confirm(`Really delete all data for ${ip}?`)) return;

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
      alert("Delete failed: " + err.message);
    }
  };

  const entries = Object.entries(users);
  const isOnline = (u) => u.currentPage && u.currentPage !== "offline";

  const onlineEntries = [];
  const offlineEntries = [];
  for (let [ip, u] of entries) {
    if (isOnline(u)) onlineEntries.push([ip, u]);
    else offlineEntries.push([ip, u]);
  }
  const sortedEntries = [...onlineEntries, ...offlineEntries];

  return (
    <table className="table">
      <thead>
        <tr>
          <th>#</th>
          <th>الاسم</th>
          <th>جديد</th>
          <th>بطاقة</th>
          <th>الصفحة</th>
          <th>الحالة</th>
          <th>معلومات</th>
          <th>حذف</th>
        </tr>
      </thead>
      <tbody>
        {sortedEntries.map(([ip, u], i) => {
          const isHighlighted = ip === highlightIp || ip === cardIp;
          const displayName = u.name || u.FullName || "—";
          
          // تحديد فئة الصف بناءً على الحالة - الأحمر للرسائل الجديدة
          let rowClass = '';
          if (u.hasNewData) {
            rowClass = 'new-message-row'; // صف أحمر للرسائل الجديدة
          } else if (u.hasPayment) {
            rowClass = 'paid-row'; // صف أخضر للمستخدمين المدفوعين
          } else if (u.flag) {
            rowClass = 'flagged-row'; // صف أصفر للمستخدمين المعلمين
          }
          
          if (isHighlighted) {
            rowClass += ' highlighted-row';
          }
          
          return (
            <tr 
              key={ip} 
              className={rowClass.trim()}
            >
              <td data-label="#">{i + 1}</td>
              <td data-label="الاسم">
                <span className={`user-name ${u.hasNewData ? 'new-indicator' : ''}`}>
                  {displayName}
                  {u.hasNewData && (
                    <span className="new-indicator-badge">جديد</span>
                  )}
                </span>
                {u.hasPayment && (
                  <span className="status-badge paid" style={{marginRight: '8px'}}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    مدفوع
                  </span>
                )}
              </td>
              <td data-label="جديد">
                <span className={`status-badge ${u.hasNewData ? 'has-new-data' : 'no-data'}`}>
                  {u.hasNewData ? (
                    <>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                        <line x1="12" y1="9" x2="12" y2="13"></line>
                        <line x1="12" y1="17" x2="12.01" y2="17"></line>
                      </svg>
                      نعم
                    </>
                  ) : (
                    <>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10"></circle>
                      </svg>
                      لا
                    </>
                  )}
                </span>
              </td>
              <td data-label="بطاقة">
                <button
                  className="btn btn-success btn-sm"
                  onClick={() => onShowCard(ip)}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                    <line x1="1" y1="10" x2="23" y2="10"></line>
                  </svg>
                  بطاقة
                </button>
              </td>
              <td data-label="الصفحة">
                <span className="page-badge">{(u.currentPage || "offline").replace(".html", "")}</span>
              </td>
              <td data-label="الحالة">
                <span className={`status-badge ${isOnline(u) ? 'online' : 'offline'}`}>
                  {isOnline(u) ? (
                    <>
                      <span className="status-dot online"></span>
                      متصل
                    </>
                  ) : (
                    <>
                      <span className="status-dot offline"></span>
                      غير متصل
                    </>
                  )}
                </span>
              </td>
              <td data-label="معلومات">
                <button
                  className="btn btn-info btn-sm"
                  onClick={() => onShowInfo(ip)}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="16" x2="12" y2="12"></line>
                    <line x1="12" y1="8" x2="12.01" y2="8"></line>
                  </svg>
                  معلومات
                </button>
              </td>
              <td data-label="حذف">
                <button
                  className="btn btn-outline-danger btn-sm"
                  onClick={() => handleDelete(ip)}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  </svg>
                  حذف
                </button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
