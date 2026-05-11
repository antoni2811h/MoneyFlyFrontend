import Sidebar from './Sidebar';
import Topnav from './Topnav';

export default function AppLayout({ children, activePage, onNuevoGasto, badges }) {
  return (
    <>
      <Topnav activePage={activePage} />
      <div className="layout">
        <Sidebar
          activePage={activePage}
          onNuevoGasto={onNuevoGasto}
          badges={badges}
        />
        <main className="main">
          {children}
        </main>
      </div>
    </>
  );
}