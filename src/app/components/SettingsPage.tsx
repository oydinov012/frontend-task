
import { useState } from 'react';
import { User, Bell, Palette, Shield, ChevronRight } from 'lucide-react';
import { PageHeader, PrimaryButton, GhostButton } from './SharedUI';

const sections = [
  { icon: User, label: 'Profile', id: 'profile' },
  { icon: Bell, label: 'Notifications', id: 'notifications' },
  { icon: Palette, label: 'Appearance', id: 'appearance' },
  { icon: Shield, label: 'Privacy & Security', id: 'privacy' },
];

export function SettingsPage() {
  const [active, setActive] = useState('profile');
  const [name, setName] = useState('John Doe');
  const [email, setEmail] = useState('john.doe@company.com');
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifDesk, setNotifDesk] = useState(false);
  const [notifSummary, setNotifSummary] = useState(true);
  const [focused, setFocused] = useState<string | null>(null);

  const inputStyle = (name: string): React.CSSProperties => ({
    width: '100%',
    background: '#0e0e0e',
    border: `1px solid ${focused === name ? '#2d5bff' : '#434656'}`,
    borderRadius: 6,
    padding: '9px 12px',
    color: '#e5e2e1',
    fontSize: 14,
    outline: focused === name ? '2px solid rgba(45,91,255,0.2)' : 'none',
    outlineOffset: 0,
    transition: 'border-color 0.15s',
    fontFamily: 'Inter, sans-serif',
    boxSizing: 'border-box' as const,
  });

  return (
    <div style={{ padding: '32px', fontFamily: 'Inter, sans-serif', color: '#e5e2e1', maxWidth: 900 }}>
      <PageHeader title="Settings" subtitle="Manage your workspace preferences" />

      <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: 20 }}>
        {/* Nav */}
        <div
          style={{
            background: '#1c1b1b',
            border: '1px solid #2a2a2a',
            borderRadius: 8,
            padding: '8px',
            height: 'fit-content',
          }}
        >
          {sections.map(({ icon: Icon, label, id }) => (
            <button
              key={id}
              onClick={() => setActive(id)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '9px 12px',
                borderRadius: 6,
                background: active === id ? 'rgba(184,195,255,0.08)' : 'transparent',
                border: 'none',
                color: active === id ? '#b8c3ff' : '#c4c5d9',
                cursor: 'pointer',
                fontSize: 14,
                fontWeight: active === id ? 600 : 400,
                fontFamily: 'Inter, sans-serif',
                textAlign: 'left',
                transition: 'all 0.15s',
                marginBottom: 2,
              }}
            >
              <Icon size={15} />
              <span style={{ flex: 1 }}>{label}</span>
              {active === id && <ChevronRight size={13} />}
            </button>
          ))}
        </div>

        {/* Content */}
        <div
          style={{
            background: '#1c1b1b',
            border: '1px solid #2a2a2a',
            borderRadius: 8,
            padding: '28px',
          }}
        >
          {active === 'profile' && (
            <div>
              <h2 style={{ margin: '0 0 4px', fontSize: 16, fontWeight: 600, color: '#e5e2e1' }}>
                Profile
              </h2>
              <p style={{ margin: '0 0 24px', fontSize: 13, color: '#8e90a2' }}>
                Update your personal information.
              </p>

              {/* Avatar */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 28 }}>
                <div
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #2d5bff, #b8c3ff)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 22,
                    fontWeight: 700,
                    color: 'white',
                    flexShrink: 0,
                  }}
                >
                  JD
                </div>
                <div>
                  <GhostButton>Change Avatar</GhostButton>
                  <p style={{ margin: '6px 0 0', fontSize: 12, color: '#8e90a2' }}>
                    PNG, JPG up to 2MB
                  </p>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#8e90a2', letterSpacing: '0.05em', marginBottom: 6 }}>
                    FULL NAME
                  </label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onFocus={() => setFocused('name')}
                    onBlur={() => setFocused(null)}
                    style={inputStyle('name')}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#8e90a2', letterSpacing: '0.05em', marginBottom: 6 }}>
                    EMAIL
                  </label>
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setFocused('email')}
                    onBlur={() => setFocused(null)}
                    style={inputStyle('email')}
                  />
                </div>
              </div>
              <div style={{ marginBottom: 24 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#8e90a2', letterSpacing: '0.05em', marginBottom: 6 }}>
                  ROLE
                </label>
                <input
                  defaultValue="Product Designer"
                  onFocus={() => setFocused('role')}
                  onBlur={() => setFocused(null)}
                  style={inputStyle('role')}
                />
              </div>
              <PrimaryButton>Save Changes</PrimaryButton>
            </div>
          )}

          {active === 'notifications' && (
            <div>
              <h2 style={{ margin: '0 0 4px', fontSize: 16, fontWeight: 600, color: '#e5e2e1' }}>
                Notifications
              </h2>
              <p style={{ margin: '0 0 24px', fontSize: 13, color: '#8e90a2' }}>
                Choose what you want to be notified about.
              </p>

              {[
                { label: 'Email notifications', sub: 'Receive task reminders via email', val: notifEmail, set: setNotifEmail },
                { label: 'Desktop notifications', sub: 'Show browser push notifications', val: notifDesk, set: setNotifDesk },
                { label: 'Weekly summary', sub: 'Get a weekly productivity report', val: notifSummary, set: setNotifSummary },
              ].map((item) => (
                <div
                  key={item.label}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '14px 0',
                    borderBottom: '1px solid #2a2a2a',
                  }}
                >
                  <div>
                    <div style={{ fontSize: 14, color: '#e5e2e1', fontWeight: 500 }}>{item.label}</div>
                    <div style={{ fontSize: 12, color: '#8e90a2', marginTop: 2 }}>{item.sub}</div>
                  </div>
                  <button
                    onClick={() => item.set(!item.val)}
                    style={{
                      width: 42,
                      height: 24,
                      borderRadius: 9999,
                      background: item.val ? '#2d5bff' : '#353534',
                      border: 'none',
                      cursor: 'pointer',
                      position: 'relative',
                      transition: 'background 0.2s',
                      flexShrink: 0,
                    }}
                  >
                    <div
                      style={{
                        position: 'absolute',
                        width: 18,
                        height: 18,
                        borderRadius: '50%',
                        background: 'white',
                        top: 3,
                        left: item.val ? 21 : 3,
                        transition: 'left 0.2s',
                      }}
                    />
                  </button>
                </div>
              ))}
            </div>
          )}

          {active === 'appearance' && (
            <div>
              <h2 style={{ margin: '0 0 4px', fontSize: 16, fontWeight: 600, color: '#e5e2e1' }}>
                Appearance
              </h2>
              <p style={{ margin: '0 0 24px', fontSize: 13, color: '#8e90a2' }}>
                Customize your workspace look & feel.
              </p>

              <div style={{ marginBottom: 24 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#8e90a2', letterSpacing: '0.05em', marginBottom: 12 }}>
                  THEME
                </label>
                <div style={{ display: 'flex', gap: 12 }}>
                  {[
                    { id: 'dark', label: 'Dark', bg: '#131313', border: '#434656' },
                    { id: 'dim', label: 'Dim', bg: '#1c1b1b', border: '#434656' },
                  ].map((theme) => (
                    <div
                      key={theme.id}
                      style={{
                        flex: 1,
                        border: `2px solid ${theme.id === 'dark' ? '#2d5bff' : '#434656'}`,
                        borderRadius: 8,
                        padding: 12,
                        cursor: 'pointer',
                        background: theme.bg,
                      }}
                    >
                      <div
                        style={{
                          height: 48,
                          borderRadius: 6,
                          background: theme.bg,
                          border: `1px solid ${theme.border}`,
                          marginBottom: 8,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: 6,
                        }}
                      >
                        <div style={{ width: 24, height: 4, background: '#e5e2e1', borderRadius: 9999 }} />
                        <div style={{ width: 14, height: 4, background: '#434656', borderRadius: 9999 }} />
                      </div>
                      <div style={{ fontSize: 13, color: '#e5e2e1', fontWeight: theme.id === 'dark' ? 600 : 400, textAlign: 'center' }}>
                        {theme.label}
                        {theme.id === 'dark' && (
                          <span style={{ marginLeft: 6, fontSize: 11, color: '#b8c3ff' }}>Active</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#8e90a2', letterSpacing: '0.05em', marginBottom: 12 }}>
                  ACCENT COLOR
                </label>
                <div style={{ display: 'flex', gap: 10 }}>
                  {['#2d5bff', '#4edea3', '#ffb95f', '#ffb4ab', '#b8c3ff'].map((color) => (
                    <button
                      key={color}
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: '50%',
                        background: color,
                        border: color === '#2d5bff' ? '3px solid white' : '3px solid transparent',
                        cursor: 'pointer',
                        boxSizing: 'border-box',
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {active === 'privacy' && (
            <div>
              <h2 style={{ margin: '0 0 4px', fontSize: 16, fontWeight: 600, color: '#e5e2e1' }}>
                Privacy & Security
              </h2>
              <p style={{ margin: '0 0 24px', fontSize: 13, color: '#8e90a2' }}>
                Manage your account security settings.
              </p>

              <div
                style={{
                  background: '#201f1f',
                  border: '1px solid #2a2a2a',
                  borderRadius: 8,
                  padding: '16px 20px',
                  marginBottom: 16,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div style={{ fontSize: 14, fontWeight: 500, color: '#e5e2e1' }}>Two-factor authentication</div>
                  <div style={{ fontSize: 12, color: '#8e90a2', marginTop: 2 }}>Add an extra layer of security</div>
                </div>
                <GhostButton>Enable 2FA</GhostButton>
              </div>

              <div
                style={{
                  background: '#201f1f',
                  border: '1px solid #2a2a2a',
                  borderRadius: 8,
                  padding: '16px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div style={{ fontSize: 14, fontWeight: 500, color: '#e5e2e1' }}>Change Password</div>
                  <div style={{ fontSize: 12, color: '#8e90a2', marginTop: 2 }}>Last changed 30 days ago</div>
                </div>
                <GhostButton>Update</GhostButton>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
