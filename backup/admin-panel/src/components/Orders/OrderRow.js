const OrderRow = ({ order }) => (
    <tr>
      <td>{order.id}</td>
      <td>{order.customerName}</td>
      <td>
      {order.products.map((product, index) => (
      <div key={index} className="product-details">
      <img src={product.productId.image} alt={product.productId.name} />
      <span>{product.productId.name} ({product.quantity})</span>
      </div>
      ))}
      </td>
      <td>{order.status}</td>
      <td>
        <button onClick={() => updateOrderStatus(order.id, 'Shipped')}>Mark as Shipped</button>
        <button onClick={() => downloadInvoice(order.id)}>Download Invoice</button>
      </td>
    </tr>
  );
  
  export default OrderRow;