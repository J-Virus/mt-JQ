$(function () {
  if (!localStorage.getItem('cartData')) {
    localStorage.setItem('cartData', '[]');
  }
  // 点击购物车 进入购物车
  $('#myCart').on('click', toCart);
  function toCart () {
    $('#foods').hide(500);
    $('#cart').show(500);
    let cartData = JSON.parse(localStorage.getItem('cartData'));
    $('#cart').find('tr:gt(0)').remove();
    cartData.forEach(item => {
      $('#cart').children('table').append($(`
        <tr>
          <td><input type="checkbox"></td>
          <td>${item.name}</td>
          <td>${item.price}</td>
          <td><input type="button" value="-" class="numMinus"><input type="text" value=${item.count} class="cartNum"><input type="button" value="+" class="numAdd"></td>
          <td><input type="button" value="删除" class="deleteBtn"></td>
        </tr>
      `))
    });
    canSelectAll();
  }
  // 点击继续点餐 回到点餐页面
  $('#toFoodView').on('click', toFood)
  function toFood () {
    $('#foods').show(500);
    $('#cart').hide(500);
  }
  // 点击加入购物车按钮
  $('#foods').find('button').on('click', addCart)
  function addCart () {
    let isNew = true;
    let cartData = JSON.parse(localStorage.getItem('cartData'));
    if (cartData) {
      cartData.forEach(item => {
        if (item.name == $(this).parent().children('span:eq(0)').text()) {
          item.count++;
          isNew = false;
        }
      });
    }
    if (isNew) {
      let currentFood = {};
      currentFood['name'] = $(this).parent().children('span:eq(0)').text();
      currentFood['price'] = parseFloat($(this).parent().children('span:eq(1)').text());
      currentFood['count'] = 1;
      cartData.push(currentFood);
    }
    console.log(cartData);
    localStorage.setItem('cartData', JSON.stringify(cartData));
    $('selectAll').prop('checked', false);
    setCartNum()
  }
  // 我的购物车数量变化
  function setCartNum () {
    let cartData = JSON.parse(localStorage.getItem('cartData'));
    $('#myCart').find('i').text(cartData.reduce((prev, cur) => prev += cur.count, 0))
  }
  // 初始化
  setCartNum();
  // 全选
  $('#selectAll').on('click', selectAll);
  function selectAll () {
    $('#cart').find(':checkbox:not("#selectAll")').prop('checked', $(this).prop('checked'))
    $('#delAll').prop('disabled', !$('#selectAll').prop('checked'));
    getSum ()
  }
  // 反选
  $('#cart').on('change', ':checkbox:not("#selectAll")', backSelect);
  function backSelect () {
    $('#cart :checkbox:not("#selectAll"):checked').length == $('#cart :checkbox').length-1 ? $('#selectAll').prop('checked', true) : $('#selectAll').prop('checked', false);
    $('#delAll').prop('disabled', !$('#selectAll').prop('checked'))
    getSum()
  }
  // 判断全选可用与否
  function canSelectAll () {
    if ($('#cart :checkbox').length == 1) {
      $('#selectAll').prop('checked', false)
      $('#selectAll').prop('disabled', true)
      $('#delAll').prop('disabled', true)
      $('.msg').text('购物车空')
    } else {
      $('#selectAll').prop('disabled', false);
      $('.msg').text('')
    }
  }
  // 删除一行
  $('#cart').on('click', '.deleteBtn', deleteOneFood)
  function deleteOneFood () {
    let cartData = JSON.parse(localStorage.getItem('cartData'));
    cartData.forEach((item, index) => {
      if (item.name == $(this).parents('tr').find('td:eq(1)').text()) {
        cartData.splice(index, 1);
        localStorage.setItem('cartData', JSON.stringify(cartData));
      }
    })
    $(this).parents('tr').remove()
    setCartNum();
    backSelect();
    canSelectAll();
    getSum ()
  }
  // 删除所有
  $('#delAll').on('click', clearCart);
  function clearCart () {
    $('#cart :checkbox:not("#selectAll")').parents('tr').remove();
    localStorage.clear('cartData')
    $('#myCart').find('i').text(0);
    canSelectAll();
    getSum ()
  }
  // 数量减
  $('#cart').on('click', '.numMinus', numMinus);
  $('#cart').on('click', '.numAdd', numAdd);
  $('#cart').on('keyup', '.cartNum', changeCount);
  // $('#cart').on('change', '.cartNum', changeCount);
  function numMinus () {
    if ($(this).siblings('.cartNum').val() > 1) {
      $(this).siblings('.cartNum').val($(this).siblings('.cartNum').val()-1);
      upDateLocalStorage($(this), '-')
    }
    setCartNum();
    getSum();
  }
  function numAdd () {
    $(this).siblings('.cartNum').val(parseInt($(this).siblings('.cartNum').val())+1);
    upDateLocalStorage($(this), '+');
    setCartNum();
    getSum();
  }
  function changeCount (e) {
    if (isNaN(parseInt($(this).val())) || parseInt($(this).val()) < 1) {
      alert('输入有误');
      e.preventDefault();
      $(this).val($(this).val().slice(1));
    } else {
      $(this).val(parseInt($(this).val()));
    }
  }
  // 加减是更新localStorage
  function upDateLocalStorage (ele, symbol) {
    let cartData = JSON.parse(localStorage.getItem('cartData'));
    cartData.forEach(item => {
      if (ele.parents('tr').children(':eq(1)').text() == item.name) {
        symbol == '+' ? item.count++ : item.count--;
      }
    });
    localStorage.setItem('cartData', JSON.stringify(cartData));
  }
  // 显示总价
  function getSum () {
    let sum = 0;
    let trs =  $('#cart :checkbox:gt(0)');
    trs.each((index, item) => {
      if (item.checked) {
        sum += $(item).parents('tr').children().eq(2).text() * $(item).parents('tr').find('.cartNum').val()
      }
    });
    $('#total').text(sum);
  }
  // 结算
  $('#account').on('click', countPay);
  function countPay () {
    let trs =  $('#cart :checkbox:gt(0)');
    trs.each((index, item) => {
      if (item.checked) {
        let cartData = JSON.parse(localStorage.getItem('cartData'));
        cartData.forEach((t, i) => {
          if ($(item).parents('tr').children().eq(1).text() == t.name) {
            cartData.splice(i,1)
          }
        });
        localStorage.setItem('cartData', JSON.stringify(cartData));
      }
    });
    $('#cart :checked:not("#selectAll")').parents('tr').remove();
    canSelectAll();
    setCartNum();
    getSum();
  }
})