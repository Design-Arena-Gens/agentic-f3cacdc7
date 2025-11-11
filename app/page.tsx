'use client'

import { useState, useEffect } from 'react'

interface User {
  id: string
  username: string
  role: 'admin' | 'client'
  name: string
}

interface Client {
  id: string
  name: string
  email: string
  phone: string
  dogName: string
  plan: string
  status: 'active' | 'inactive'
  lastPayment: string
  paymentAmount: number
}

interface MediaItem {
  id: string
  type: 'photo' | 'video'
  url: string
  title: string
  clientId: string
  clientName: string
  uploadDate: string
}

interface Notification {
  id: string
  title: string
  message: string
  date: string
  read: boolean
}

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [activeTab, setActiveTab] = useState('gallery')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [modalType, setModalType] = useState<'client' | 'media' | 'notification' | 'payment'>('client')

  const [clients, setClients] = useState<Client[]>([
    {
      id: '1',
      name: 'Maria Silva',
      email: 'maria@email.com',
      phone: '(11) 98765-4321',
      dogName: 'Rex',
      plan: 'Mensal',
      status: 'active',
      lastPayment: '2024-01-10',
      paymentAmount: 350
    },
    {
      id: '2',
      name: 'João Santos',
      email: 'joao@email.com',
      phone: '(11) 91234-5678',
      dogName: 'Bella',
      plan: 'Semanal',
      status: 'active',
      lastPayment: '2024-01-15',
      paymentAmount: 120
    }
  ])

  const [mediaItems, setMediaItems] = useState<MediaItem[]>([
    {
      id: '1',
      type: 'photo',
      url: '',
      title: 'Rex - Treino de Obediência',
      clientId: '1',
      clientName: 'Maria Silva',
      uploadDate: '2024-01-18'
    },
    {
      id: '2',
      type: 'video',
      url: '',
      title: 'Bella - Progresso Semanal',
      clientId: '2',
      clientName: 'João Santos',
      uploadDate: '2024-01-17'
    }
  ])

  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'Novo Cliente Cadastrado',
      message: 'Maria Silva foi adicionada como cliente',
      date: '2024-01-18',
      read: false
    },
    {
      id: '2',
      title: 'Pagamento Recebido',
      message: 'João Santos - R$ 120,00',
      date: '2024-01-15',
      read: false
    }
  ])

  const [newClient, setNewClient] = useState({
    name: '',
    email: '',
    phone: '',
    dogName: '',
    plan: 'Mensal',
    paymentAmount: 350
  })

  const [newMedia, setNewMedia] = useState({
    title: '',
    clientId: '',
    type: 'photo' as 'photo' | 'video'
  })

  const [paymentData, setPaymentData] = useState({
    clientId: '',
    amount: 0,
    method: 'Dinheiro',
    date: new Date().toISOString().split('T')[0]
  })

  useEffect(() => {
    const stored = localStorage.getItem('currentUser')
    if (stored) {
      setCurrentUser(JSON.parse(stored))
      setIsLoggedIn(true)
    }
  }, [])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()

    // Default credentials
    if (username === 'admin' && password === 'admin123') {
      const user: User = { id: '1', username: 'admin', role: 'admin', name: 'Adalberto Alves' }
      setCurrentUser(user)
      setIsLoggedIn(true)
      localStorage.setItem('currentUser', JSON.stringify(user))
    } else if (username === 'cliente' && password === 'cliente123') {
      const user: User = { id: '2', username: 'cliente', role: 'client', name: 'Maria Silva' }
      setCurrentUser(user)
      setIsLoggedIn(true)
      localStorage.setItem('currentUser', JSON.stringify(user))
    } else {
      alert('Usuário ou senha incorretos!')
    }
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setCurrentUser(null)
    localStorage.removeItem('currentUser')
  }

  const handleAddClient = (e: React.FormEvent) => {
    e.preventDefault()
    const client: Client = {
      id: Date.now().toString(),
      ...newClient,
      status: 'active',
      lastPayment: new Date().toISOString().split('T')[0]
    }
    setClients([...clients, client])
    setNewClient({ name: '', email: '', phone: '', dogName: '', plan: 'Mensal', paymentAmount: 350 })
    setShowModal(false)

    const notification: Notification = {
      id: Date.now().toString(),
      title: 'Novo Cliente Cadastrado',
      message: `${client.name} foi adicionado como cliente`,
      date: new Date().toISOString().split('T')[0],
      read: false
    }
    setNotifications([notification, ...notifications])
  }

  const handleAddMedia = (e: React.FormEvent) => {
    e.preventDefault()
    const client = clients.find(c => c.id === newMedia.clientId)
    if (!client) return

    const media: MediaItem = {
      id: Date.now().toString(),
      ...newMedia,
      url: '',
      clientName: client.name,
      uploadDate: new Date().toISOString().split('T')[0]
    }
    setMediaItems([media, ...mediaItems])
    setNewMedia({ title: '', clientId: '', type: 'photo' })
    setShowModal(false)

    const notification: Notification = {
      id: Date.now().toString(),
      title: 'Nova Mídia Adicionada',
      message: `${media.title} para ${client.name}`,
      date: new Date().toISOString().split('T')[0],
      read: false
    }
    setNotifications([notification, ...notifications])
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const media: MediaItem = {
          id: Date.now().toString(),
          type: file.type.startsWith('video') ? 'video' : 'photo',
          url: reader.result as string,
          title: file.name,
          clientId: clients[0]?.id || '',
          clientName: clients[0]?.name || '',
          uploadDate: new Date().toISOString().split('T')[0]
        }
        setMediaItems([media, ...mediaItems])
      }
      reader.readAsDataURL(file)
    }
  }

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault()
    const client = clients.find(c => c.id === paymentData.clientId)
    if (!client) return

    setClients(clients.map(c =>
      c.id === paymentData.clientId
        ? { ...c, lastPayment: paymentData.date, paymentAmount: paymentData.amount }
        : c
    ))

    const notification: Notification = {
      id: Date.now().toString(),
      title: 'Pagamento Recebido',
      message: `${client.name} - R$ ${paymentData.amount.toFixed(2)}`,
      date: paymentData.date,
      read: false
    }
    setNotifications([notification, ...notifications])

    setPaymentData({ clientId: '', amount: 0, method: 'Dinheiro', date: new Date().toISOString().split('T')[0] })
    setShowModal(false)
    alert('Pagamento registrado com sucesso!')
  }

  const handleDeleteMedia = (id: string) => {
    if (confirm('Deseja realmente excluir esta mídia?')) {
      setMediaItems(mediaItems.filter(m => m.id !== id))
    }
  }

  const markNotificationRead = (id: string) => {
    setNotifications(notifications.map(n =>
      n.id === id ? { ...n, read: true } : n
    ))
  }

  const unreadCount = notifications.filter(n => !n.read).length

  if (!isLoggedIn) {
    return (
      <div className="login-container">
        <div className="login-box">
          <div className="login-header">
            <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🐕</div>
            <h2>Adalberto Alves</h2>
            <p style={{ color: '#aaa', marginTop: '5px' }}>Personal Dog Training</p>
          </div>
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label>Usuário</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Digite seu usuário"
                required
              />
            </div>
            <div className="form-group">
              <label>Senha</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Digite sua senha"
                required
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Entrar
            </button>
          </form>
          <div style={{ marginTop: '30px', padding: '20px', background: '#1a1a2e', borderRadius: '10px' }}>
            <p style={{ fontSize: '0.9rem', color: '#aaa', marginBottom: '10px' }}>Credenciais de teste:</p>
            <p style={{ fontSize: '0.85rem', color: '#ddd' }}>Admin: admin / admin123</p>
            <p style={{ fontSize: '0.85rem', color: '#ddd' }}>Cliente: cliente / cliente123</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      <button onClick={handleLogout} className="logout-btn">
        Sair
      </button>

      <div className="header">
        <div className="profile-pic">🐕</div>
        <div className="header-info">
          <h1>Adalberto Alves</h1>
          <p>Personal Dog Training</p>
        </div>
      </div>

      <div className="nav-tabs">
        <button
          className={`tab-btn ${activeTab === 'gallery' ? 'active' : ''}`}
          onClick={() => setActiveTab('gallery')}
        >
          📸 Galeria
        </button>
        {currentUser?.role === 'admin' && (
          <>
            <button
              className={`tab-btn ${activeTab === 'clients' ? 'active' : ''}`}
              onClick={() => setActiveTab('clients')}
            >
              👥 Clientes
            </button>
            <button
              className={`tab-btn ${activeTab === 'payments' ? 'active' : ''}`}
              onClick={() => setActiveTab('payments')}
            >
              💳 Pagamentos
            </button>
          </>
        )}
        <button
          className={`tab-btn ${activeTab === 'notifications' ? 'active' : ''}`}
          onClick={() => setActiveTab('notifications')}
        >
          🔔 Notificações
          {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
        </button>
      </div>

      {activeTab === 'gallery' && (
        <>
          {currentUser?.role === 'admin' && (
            <>
              <div className="upload-zone" onClick={() => document.getElementById('file-upload')?.click()}>
                <div style={{ fontSize: '3rem' }}>📤</div>
                <p>Clique para fazer upload de fotos ou vídeos</p>
                <input
                  id="file-upload"
                  type="file"
                  accept="image/*,video/*"
                  onChange={handleFileUpload}
                  className="file-input-hidden"
                />
              </div>
              <button
                className="btn btn-primary"
                style={{ marginBottom: '30px' }}
                onClick={() => { setModalType('media'); setShowModal(true); }}
              >
                ➕ Adicionar Mídia
              </button>
            </>
          )}

          <div className="content-grid">
            {mediaItems.map(item => (
              <div key={item.id} className="media-card">
                <div className="media-preview">
                  {item.url ? (
                    item.type === 'video' ? (
                      <video src={item.url} controls />
                    ) : (
                      <img src={item.url} alt={item.title} />
                    )
                  ) : (
                    <span>{item.type === 'video' ? '🎥' : '📷'}</span>
                  )}
                </div>
                <div className="media-info">
                  <h3>{item.title}</h3>
                  <p>Cliente: {item.clientName}</p>
                  <p>Data: {new Date(item.uploadDate).toLocaleDateString('pt-BR')}</p>
                  {currentUser?.role === 'admin' && (
                    <div className="media-actions">
                      <button
                        className="btn-small btn-delete"
                        onClick={() => handleDeleteMedia(item.id)}
                      >
                        🗑️ Excluir
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {activeTab === 'clients' && currentUser?.role === 'admin' && (
        <>
          <button
            className="btn btn-primary"
            style={{ marginBottom: '30px' }}
            onClick={() => { setModalType('client'); setShowModal(true); }}
          >
            ➕ Adicionar Cliente
          </button>

          <div className="stats-grid">
            <div className="stat-card">
              <h4>Total de Clientes</h4>
              <div className="stat-value">{clients.length}</div>
            </div>
            <div className="stat-card">
              <h4>Clientes Ativos</h4>
              <div className="stat-value">{clients.filter(c => c.status === 'active').length}</div>
            </div>
            <div className="stat-card">
              <h4>Receita Mensal</h4>
              <div className="stat-value">
                R$ {clients.reduce((sum, c) => sum + (c.plan === 'Mensal' ? c.paymentAmount : 0), 0)}
              </div>
            </div>
          </div>

          <div className="content-grid">
            {clients.map(client => (
              <div key={client.id} className="client-card">
                <h3>{client.name}</h3>
                <div className="client-info">
                  <p><strong>Email:</strong> {client.email}</p>
                  <p><strong>Telefone:</strong> {client.phone}</p>
                  <p><strong>Cachorro:</strong> {client.dogName}</p>
                  <p><strong>Plano:</strong> {client.plan}</p>
                  <p><strong>Status:</strong> {client.status === 'active' ? '✅ Ativo' : '❌ Inativo'}</p>
                  <p><strong>Último Pagamento:</strong> {new Date(client.lastPayment).toLocaleDateString('pt-BR')}</p>
                  <p><strong>Valor:</strong> R$ {client.paymentAmount.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {activeTab === 'payments' && currentUser?.role === 'admin' && (
        <>
          <button
            className="btn btn-primary"
            style={{ marginBottom: '30px' }}
            onClick={() => { setModalType('payment'); setShowModal(true); }}
          >
            💰 Registrar Pagamento
          </button>

          <div className="payment-receipt">
            <div className="receipt-header">
              <h3>📋 Resumo Financeiro</h3>
              <p style={{ color: '#aaa', fontSize: '0.9rem' }}>Mês Atual</p>
            </div>
            {clients.map(client => (
              <div key={client.id} className="receipt-row">
                <span>{client.name}</span>
                <span>R$ {client.paymentAmount.toFixed(2)}</span>
              </div>
            ))}
            <div className="receipt-total">
              <span>TOTAL</span>
              <span>R$ {clients.reduce((sum, c) => sum + c.paymentAmount, 0).toFixed(2)}</span>
            </div>
          </div>
        </>
      )}

      {activeTab === 'notifications' && (
        <div className="notification-list">
          {notifications.map(notification => (
            <div
              key={notification.id}
              className={`notification-item ${!notification.read ? 'unread' : ''}`}
              onClick={() => markNotificationRead(notification.id)}
            >
              <h4>{notification.title}</h4>
              <p>{notification.message}</p>
              <small>{new Date(notification.date).toLocaleDateString('pt-BR')}</small>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="modal" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>
                {modalType === 'client' && '➕ Novo Cliente'}
                {modalType === 'media' && '📸 Nova Mídia'}
                {modalType === 'payment' && '💰 Registrar Pagamento'}
              </h2>
              <button className="btn-close" onClick={() => setShowModal(false)}>×</button>
            </div>

            {modalType === 'client' && (
              <form onSubmit={handleAddClient}>
                <div className="form-group">
                  <label>Nome do Cliente</label>
                  <input
                    type="text"
                    value={newClient.name}
                    onChange={(e) => setNewClient({...newClient, name: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    value={newClient.email}
                    onChange={(e) => setNewClient({...newClient, email: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Telefone</label>
                  <input
                    type="tel"
                    value={newClient.phone}
                    onChange={(e) => setNewClient({...newClient, phone: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Nome do Cachorro</label>
                  <input
                    type="text"
                    value={newClient.dogName}
                    onChange={(e) => setNewClient({...newClient, dogName: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Plano</label>
                  <select
                    value={newClient.plan}
                    onChange={(e) => setNewClient({...newClient, plan: e.target.value})}
                  >
                    <option value="Semanal">Semanal</option>
                    <option value="Mensal">Mensal</option>
                    <option value="Trimestral">Trimestral</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Valor do Pagamento (R$)</label>
                  <input
                    type="number"
                    value={newClient.paymentAmount}
                    onChange={(e) => setNewClient({...newClient, paymentAmount: Number(e.target.value)})}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary">Adicionar Cliente</button>
              </form>
            )}

            {modalType === 'media' && (
              <form onSubmit={handleAddMedia}>
                <div className="form-group">
                  <label>Título</label>
                  <input
                    type="text"
                    value={newMedia.title}
                    onChange={(e) => setNewMedia({...newMedia, title: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Cliente</label>
                  <select
                    value={newMedia.clientId}
                    onChange={(e) => setNewMedia({...newMedia, clientId: e.target.value})}
                    required
                  >
                    <option value="">Selecione um cliente</option>
                    {clients.map(client => (
                      <option key={client.id} value={client.id}>{client.name}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Tipo</label>
                  <select
                    value={newMedia.type}
                    onChange={(e) => setNewMedia({...newMedia, type: e.target.value as 'photo' | 'video'})}
                  >
                    <option value="photo">Foto</option>
                    <option value="video">Vídeo</option>
                  </select>
                </div>
                <button type="submit" className="btn btn-primary">Adicionar Mídia</button>
              </form>
            )}

            {modalType === 'payment' && (
              <form onSubmit={handlePayment}>
                <div className="form-group">
                  <label>Cliente</label>
                  <select
                    value={paymentData.clientId}
                    onChange={(e) => {
                      const client = clients.find(c => c.id === e.target.value)
                      setPaymentData({
                        ...paymentData,
                        clientId: e.target.value,
                        amount: client?.paymentAmount || 0
                      })
                    }}
                    required
                  >
                    <option value="">Selecione um cliente</option>
                    {clients.map(client => (
                      <option key={client.id} value={client.id}>{client.name}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Valor (R$)</label>
                  <input
                    type="number"
                    value={paymentData.amount}
                    onChange={(e) => setPaymentData({...paymentData, amount: Number(e.target.value)})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Método de Pagamento</label>
                  <select
                    value={paymentData.method}
                    onChange={(e) => setPaymentData({...paymentData, method: e.target.value})}
                  >
                    <option value="Dinheiro">Dinheiro</option>
                    <option value="PIX">PIX</option>
                    <option value="Cartão de Crédito">Cartão de Crédito</option>
                    <option value="Cartão de Débito">Cartão de Débito</option>
                    <option value="Transferência">Transferência</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Data</label>
                  <input
                    type="date"
                    value={paymentData.date}
                    onChange={(e) => setPaymentData({...paymentData, date: e.target.value})}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary">Registrar Pagamento</button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
