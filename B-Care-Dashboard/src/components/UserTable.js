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
          <th>Name</th>
          <th>New Data</th>
          <th>Card</th>
          <th>Page</th>
          <th>Status</th>
          <th>Info</th>
          <th>Delete</th>
        </tr>
      </thead>
      <tbody>
        {sortedEntries.map(([ip, u], i) => {
          const isHighlighted = ip === highlightIp || ip === cardIp;
          const displayName = u.name || u.FullName || "—";
          
          return (
            <tr 
              key={ip}
              className={`
                ${u.hasPayment ? 'payment-completed' : ''}
                ${isHighlighted ? 'highlighted-row' : ''}
                ${u.flag ? 'flagged-row' : ''}
              `}
            >
              <td data-label="#">{i + 1}</td>
              <td data-label="Name">
                <span className={u.hasPayment ? 'paid-name' : ''}>
                  {displayName}
                </span>
                {u.hasPayment && (
                  <span className="status-badge paid">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    PAID
                  </span>
                )}
              </td>
              <td data-label="New Data">
                <span className={`status-badge ${u.hasNewData ? 'has-new-data' : 'no-data'}`}>
                  {u.hasNewData ? (
                    <>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 16 14"></polyline>
                      </svg>
                      Yes
                    </>
                  ) : (
                    <>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                      No
                    </>
                  )}
                </span>
              </td>
              <td data-label="Card">
                <button
                  className="btn btn-success btn-sm"
                  onClick={() => onShowCard(ip)}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                    <line x1="1" y1="10" x2="23" y2="10"></line>
                  </svg>
                  Card
                </button>
              </td>
              <td data-label="Page">
                <span className="page-badge">{(u.currentPage || "offline").replace(".html", "")}</span>
              </td>
              <td data-label="Status">
                <span className={`status-badge ${isOnline(u) ? 'online' : 'offline'}`}>
                  {isOnline(u) ? (
                    <>
                      <span className="status-dot online"></span>
                      Online
                    </>
                  ) : (
                    <>
                      <span className="status-dot offline"></span>
                      Offline
                    </>
                  )}
                </span>
              </td>
              <td data-label="Info">
                <button
                  className="btn btn-info btn-sm"
                  onClick={() => onShowInfo(ip)}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="16" x2="12" y2="12"></line>
                    <line x1="12" y1="8" x2="12.01" y2="8"></line>
                  </svg>
                  Info
                </button>
              </td>
              <td data-label="Delete">
                <button
                  className="btn btn-outline-danger btn-sm"
                  onClick={() => handleDelete(ip)}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  </svg>
                  Delete
                </button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
