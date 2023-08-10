import SidebarDesktop from './SidebarDesktop';
import SidebarMobile from './SidebarMobile';

export default function Sidebar() {
    return (
        <aside className="lg:fixed lg:z-10 lg:h-[calc(100%-40px)]">
            <div className="h-full hidden lg:block">
                <SidebarDesktop />
            </div>
            <div className="block lg:hidden">
                <SidebarMobile />
            </div>
        </aside>
    );
}
