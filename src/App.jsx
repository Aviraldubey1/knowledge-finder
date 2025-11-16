import { useMemo, useState } from "react";
import { documents } from "./mockData";

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [teamFilter, setTeamFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [projectFilter, setProjectFilter] = useState("All");
  const [selectedDoc, setSelectedDoc] = useState(documents[0]);

  const teams = ["All", ...new Set(documents.map((d) => d.team))];
  const types = ["All", ...new Set(documents.map((d) => d.type))];
  const projects = ["All", ...new Set(documents.map((d) => d.project))];

  const filteredDocs = useMemo(() => {
    return documents.filter((doc) => {
      const search = searchTerm.toLowerCase();
      const matchesSearch =
        doc.title.toLowerCase().includes(search) ||
        doc.content.toLowerCase().includes(search) ||
        doc.topic.toLowerCase().includes(search) ||
        doc.tags.join(" ").toLowerCase().includes(search);

      const matchesTeam = teamFilter === "All" || doc.team === teamFilter;
      const matchesType = typeFilter === "All" || doc.type === typeFilter;
      const matchesProject =
        projectFilter === "All" || doc.project === projectFilter;

      return matchesSearch && matchesTeam && matchesType && matchesProject;
    });
  }, [searchTerm, teamFilter, typeFilter, projectFilter]);

  const statsByTeam = useMemo(() => {
    const map = {};
    documents.forEach((doc) => {
      map[doc.team] = (map[doc.team] || 0) + 1;
    });
    return map;
  }, []);

  return (
    <div style={styles.app}>
      <header style={styles.header}>
        <div>
          <h1 style={styles.title}>Marketing Knowledge Finder</h1>
          <p style={styles.subtitle}>
            Find decks, briefs, reports, and assets in seconds.
          </p>
        </div>
        <div style={styles.stats}>
          <div style={styles.statCard}>
            <div style={styles.statLabel}>Total Documents</div>
            <div style={styles.statValue}>{documents.length}</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statLabel}>Teams</div>
            <div style={styles.statValue}>{Object.keys(statsByTeam).length}</div>
          </div>
        </div>
      </header>

      <section style={styles.controls}>
        <input
          style={styles.searchInput}
          placeholder="Search by title, topic, content, or tag..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <div style={styles.filtersRow}>
          <FilterSelect
            label="Team"
            value={teamFilter}
            onChange={setTeamFilter}
            options={teams}
          />
          <FilterSelect
            label="Type"
            value={typeFilter}
            onChange={setTypeFilter}
            options={types}
          />
          <FilterSelect
            label="Project"
            value={projectFilter}
            onChange={setProjectFilter}
            options={projects}
          />
        </div>
      </section>

      <main style={styles.main}>
        <div style={styles.listPane}>
          <div style={styles.listHeader}>
            <span>Results ({filteredDocs.length})</span>
          </div>
          <div style={styles.list}>
            {filteredDocs.map((doc) => (
              <button
                key={doc.id}
                style={{
                  ...styles.listItem,
                  ...(selectedDoc?.id === doc.id ? styles.listItemActive : {}),
                }}
                onClick={() => setSelectedDoc(doc)}
              >
                <div style={styles.listItemTitle}>{doc.title}</div>
                <div style={styles.listItemMeta}>
                  <span>{doc.team}</span> • <span>{doc.project}</span> •{" "}
                  <span>{doc.type}</span>
                </div>
                <div style={styles.listItemTopic}>{doc.topic}</div>
              </button>
            ))}
            {filteredDocs.length === 0 && (
              <div style={styles.emptyState}>
                No documents found. Try changing filters or search term.
              </div>
            )}
          </div>
        </div>

        <div style={styles.detailPane}>
          {selectedDoc ? (
            <>
              <div style={styles.detailHeader}>
                <h2 style={{ margin: 0 }}>{selectedDoc.title}</h2>
                <div style={styles.detailMeta}>
                  <span>{selectedDoc.team}</span> •{" "}
                  <span>{selectedDoc.project}</span> •{" "}
                  <span>{selectedDoc.type}</span>
                </div>
              </div>
              <div style={styles.detailTags}>
                {selectedDoc.tags.map((tag) => (
                  <span key={tag} style={styles.tag}>
                    #{tag}
                  </span>
                ))}
              </div>
              <div style={styles.detailContent}>
                <h4>Summary</h4>
                <p>{selectedDoc.content}</p>
                <h4>Topic</h4>
                <p>{selectedDoc.topic}</p>
              </div>
            </>
          ) : (
            <div style={styles.emptyState}>Select a document to preview.</div>
          )}
        </div>
      </main>

      <footer style={styles.footer}>
        <small>
          Built for hackathon – Knowledge Discovery & Internal Search theme.
        </small>
      </footer>
    </div>
  );
}

function FilterSelect({ label, value, onChange, options }) {
  return (
    <label style={styles.filterLabel}>
      <span style={styles.filterText}>{label}</span>
      <select
        style={styles.select}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </label>
  );
}

const styles = {
  app: {
    fontFamily: "system-ui, sans-serif",
    minHeight: "100vh",
    background: "#f5f5f7",
    display: "flex",
    flexDirection: "column",
    padding: "16px",
    boxSizing: "border-box",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    gap: "16px",
    marginBottom: "16px",
  },
  title: { margin: 0, fontSize: "24px" },
  subtitle: { margin: 0, color: "#555" },
  stats: {
    display: "flex",
    gap: "12px",
  },
  statCard: {
    background: "#fff",
    padding: "8px 12px",
    borderRadius: "8px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
    textAlign: "right",
  },
  statLabel: { fontSize: "12px", color: "#777" },
  statValue: { fontSize: "18px", fontWeight: "bold" },
  controls: {
    marginBottom: "12px",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  searchInput: {
    padding: "8px 12px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    fontSize: "14px",
    outline: "none",
  },
  filtersRow: {
    display: "flex",
    gap: "8px",
    flexWrap: "wrap",
  },
  filterLabel: {
    display: "flex",
    flexDirection: "column",
    fontSize: "12px",
  },
  filterText: { marginBottom: "2px", color: "#555" },
  select: {
    padding: "4px 8px",
    borderRadius: "6px",
    border: "1px solid #ddd",
    fontSize: "13px",
  },
  main: {
    display: "grid",
    gridTemplateColumns: "minmax(0, 2fr) minmax(0, 3fr)",
    gap: "12px",
    flex: 1,
    minHeight: 0,
  },
  listPane: {
    background: "#fff",
    borderRadius: "12px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
    display: "flex",
    flexDirection: "column",
  },
  listHeader: {
    padding: "8px 12px",
    borderBottom: "1px solid #eee",
    fontSize: "13px",
    color: "#555",
  },
  list: {
    padding: "8px",
    overflowY: "auto",
  },
  listItem: {
    width: "100%",
    textAlign: "left",
    padding: "8px",
    borderRadius: "8px",
    border: "1px solid transparent",
    background: "transparent",
    marginBottom: "6px",
    cursor: "pointer",
  },
  listItemActive: {
    background: "#eef2ff",
    borderColor: "#4f46e5",
  },
  listItemTitle: { fontSize: "14px", fontWeight: 600 },
  listItemMeta: {
    fontSize: "11px",
    color: "#777",
    marginTop: "2px",
  },
  listItemTopic: {
    fontSize: "12px",
    marginTop: "4px",
    color: "#4f46e5",
  },
  detailPane: {
    background: "#fff",
    borderRadius: "12px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
    padding: "12px",
    display: "flex",
    flexDirection: "column",
    overflowY: "auto",
  },
  detailHeader: { marginBottom: "8px" },
  detailMeta: { fontSize: "12px", color: "#777", marginTop: "4px" },
  detailTags: { marginBottom: "8px", display: "flex", gap: "6px", flexWrap: "wrap" },
  tag: {
    fontSize: "11px",
    background: "#eef2ff",
    color: "#3730a3",
    padding: "2px 6px",
    borderRadius: "999px",
  },
  detailContent: { fontSize: "14px" },
  emptyState: {
    padding: "16px",
    textAlign: "center",
    fontSize: "14px",
    color: "#777",
  },
  footer: {
    marginTop: "8px",
    textAlign: "center",
    fontSize: "11px",
    color: "#888",
  },
};

export default App;
