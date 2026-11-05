// Drag (or tap) a pile book onto the shelf; .NET Drop(id) says if it fits, else it slides back.
window.shelfDrag = {
  init(dotnet, pile, shelf) {
    if (pile._inited) return;
    pile._inited = true;
    const back = b => {
      b.style.transition = 'transform .25s';
      b.style.transform = '';
      setTimeout(() => { b.style.transition = ''; }, 260);
    };
    pile.addEventListener('pointerdown', e => {
      const b = e.target.closest('.book');
      if (!b || e.button > 0) return;
      e.preventDefault();
      const sx = e.clientX, sy = e.clientY;
      let moved = false;
      b.setPointerCapture(e.pointerId);
      const move = ev => {
        const dx = ev.clientX - sx, dy = ev.clientY - sy;
        if (!moved && Math.hypot(dx, dy) > 6) { moved = true; b.classList.add('dragging'); }
        if (moved) b.style.transform = `translate(${dx}px,${dy}px)`;
      };
      const up = ev => {
        b.removeEventListener('pointermove', move);
        b.removeEventListener('pointerup', up);
        b.removeEventListener('pointercancel', up);
        b.classList.remove('dragging');
        const r = shelf.getBoundingClientRect();
        const over = ev.clientX >= r.left && ev.clientX <= r.right && ev.clientY >= r.top && ev.clientY <= r.bottom;
        if (ev.type === 'pointercancel' || (moved && !over)) return back(b);
        dotnet.invokeMethodAsync('Drop', +b.dataset.i).then(ok => { if (!ok) back(b); });
      };
      b.addEventListener('pointermove', move);
      b.addEventListener('pointerup', up);
      b.addEventListener('pointercancel', up);
    });
  }
};
