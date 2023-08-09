import SidebarDesktop from './SidebarDesktop';
import SidebarMobile from './SidebarMobile';

export default function Sidebar() {
    return (
        <aside>
            <div className="h-full hidden lg:block">
                <SidebarDesktop />
            </div>
            <div className="block lg:hidden">
                <SidebarMobile />
            </div>
        </aside>
    );
}
