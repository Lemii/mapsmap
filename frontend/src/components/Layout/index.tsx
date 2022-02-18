import './index.css';

import { CaretDownFilled, MenuOutlined } from '@ant-design/icons';
import { Button, Divider, Drawer, Layout, Menu } from 'antd';
import SubMenu from 'antd/lib/menu/SubMenu';
import { ReactElement, useContext, useState } from 'react';
import { isMobile } from 'react-device-detect';
import { useNavigate } from 'react-router-dom';

import Logo from '../../assets/mapsmap_white_logoSymbol.png';
import { UserContext } from '../../contexts/userContext';
import useWindowSize from '../../hooks/useWindowSize';
import SmallText from '../Generic/SmallText';

const { Header, Content, Footer } = Layout;

const menuItems: { label: string; path: string; requireAuth: boolean | null }[] = [
	{
		label: 'Problems',
		path: '/problems',
		requireAuth: null,
	},
	{
		label: 'Solutions',
		path: '/solutions',
		requireAuth: null,
	},
	{
		label: 'Overview',
		path: '/overview',
		requireAuth: false,
	},
];

type Props = { children: ReactElement };

const AppLayout = ({ children }: Props): ReactElement => {
	const [drawerIsVisible, setDrawerIsVisible] = useState(false);
	const { signOut, userCredentials } = useContext(UserContext);
	const { width } = useWindowSize();

	const navigate = useNavigate();

	const handleClick = (path: string) => {
		if (isMobile) {
			closeDrawer();
		}

		navigate(path);
	};

	const handleSignOut = () => {
		if (isMobile) {
			closeDrawer();
		}

		signOut();
	};

	const showDrawer = () => {
		setDrawerIsVisible(true);
	};

	const closeDrawer = () => {
		setDrawerIsVisible(false);
	};

	const padding = '50px';

	const layoutStyle = {
		paddingTop: isMobile || width < 600 ? '5px' : padding,
		paddingBottom: padding,
		paddingLeft: isMobile || width < 600 ? '5px' : padding,
		paddingRight: isMobile || width < 600 ? '5px' : padding,
	};

	const renderDesktopMenu = () => (
		<div style={{ display: 'flex', justifyContent: 'center' }}>
			<Menu theme="dark" mode="horizontal" className="menu">
				<Menu.Item key="Home" className="logo" onClick={() => handleClick('/')}>
					<img src={Logo} alt="Home" />
				</Menu.Item>
				{menuItems.map(({ label, path }) => (
					<Menu.Item key={label} onClick={() => handleClick(path)} className="menuItem">
						{label}
					</Menu.Item>
				))}

				<SubMenu
					key="sub1"
					title={
						<div>
							Account <CaretDownFilled />
						</div>
					}
				>
					{userCredentials ? (
						<>
							<Menu.Item key="me" onClick={() => handleClick('/persons/view/me')} className="sub-menu-item">
								Me
							</Menu.Item>
							<Menu.Item key="edit" onClick={() => handleClick('/persons/edit')} className="sub-menu-item">
								Edit Account
							</Menu.Item>
							<Menu.Item key="sign-out" onClick={handleSignOut} className="sub-menu-item">
								Sign Out
							</Menu.Item>
						</>
					) : (
						<>
							<Menu.Item key="sign-in" onClick={() => handleClick('/persons/sign-in')} className="sub-menu-item">
								Sign In
							</Menu.Item>
							<Menu.Item key="create-account" onClick={() => handleClick('/persons/add')} className="sub-menu-item">
								Create Account
							</Menu.Item>
						</>
					)}
				</SubMenu>
			</Menu>
		</div>
	);

	const renderMobileMenu = () => (
		<div
			style={{
				display: 'flex',
				justifyContent: 'space-between',
				alignItems: 'center',
				height: '2em',
				padding: '1em',
				marginTop: '1em',
			}}
		>
			<img
				src={Logo}
				alt="Home"
				onClick={() => handleClick('/')}
				style={{ height: '2em', width: '2em', cursor: 'pointer' }}
			/>

			<div className="mobile-title" onClick={() => handleClick('/')}>
				MapsMap
			</div>
			<div style={{ flexGrow: 2 }}></div>

			<Button
				size="large"
				icon={<MenuOutlined />}
				onClick={showDrawer}
				style={{
					background: 'transparent',
					color: '#fff',
					fontSize: '2em',
					border: 'none',
					margin: 'none',
					padding: 'none',
				}}
			></Button>
		</div>
	);

	const renderDrawer = () => (
		<Drawer visible={drawerIsVisible} onClose={closeDrawer} placement="right" title="Navigation" width={200}>
			{menuItems.map((item, i) => (
				<>
					<Button key={`${item.label}-mobile`} onClick={() => handleClick(item.path)} type="link">
						{item.label}
					</Button>

					{i !== menuItems.length - 1 && <Divider style={{ margin: '1em 0' }} />}
				</>
			))}

			<div className="ant-drawer-title text-center" style={{ marginBottom: '1em', marginTop: '3em' }}>
				Account
			</div>

			{!userCredentials ? (
				<>
					<Button onClick={() => handleClick('/persons/sign-in')} type="link">
						Sign In
					</Button>
					<Divider style={{ margin: '1em 0' }} />
					<Button onClick={() => handleClick('/persons/add')} type="link">
						Create Account
					</Button>
				</>
			) : (
				<>
					<Button onClick={() => handleClick('/persons/view/me')} type="link">
						Me
					</Button>
					<Divider style={{ margin: '1em 0' }} />
					<Button onClick={() => handleClick('/persons/edit')} type="link">
						Edit Account
					</Button>
					<Divider style={{ margin: '1em 0' }} />
					<Button type="link" onClick={handleSignOut}>
						Sign Out
					</Button>
					<Divider style={{ margin: '1em 0' }} />
				</>
			)}
		</Drawer>
	);

	return (
		<Layout className="layout">
			<Header style={{ padding: '0' }}>{isMobile ? renderMobileMenu() : renderDesktopMenu()}</Header>

			{drawerIsVisible && renderDrawer()}

			<Content>
				<div className="site-layout-content" style={layoutStyle}>
					{children}
				</div>
			</Content>
			<Footer className="footer">
				<strong>Mapsmap Prototype v{process.env.REACT_APP_VERSION}</strong>
				<br />
				<SmallText>© 2022 Korben &amp; Lemii</SmallText>
				<br />
			</Footer>
		</Layout>
	);
};

export default AppLayout;
