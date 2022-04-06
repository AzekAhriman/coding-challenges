import React, {useEffect, useState} from 'react';
import styles from '../assets/styles/HexViever.module.css';

interface HexViewerProps {
  data: string | Uint8Array;
}

interface SelectedElement {
  index: number | null,
  offset: number | null,
  value: number | string
}

function useCurrentWidth() {
  let [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    let timeoutId;
    const resizeListener = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => setWidth(window.innerWidth), 200);
    };
    window.addEventListener('resize', resizeListener);
    return () => window.removeEventListener('resize', resizeListener);
  }, [])

  return width;
}

export default function HexViewer(props: HexViewerProps) {
  const lines: React.ReactElement[] = [];
  const [selectedElement, setSelectedElement] = useState<SelectedElement>({
    index: null,
    offset: null,
    value: ''
  });
  const isMobile = useCurrentWidth() < 578;
  const bytesPerLine = isMobile ? 8 : 16;

  const toHex = (n: string | number, l: number) => {
    return typeof n === "string" ? Number(n.charCodeAt(0)).toString(16).padStart(l, '0') : n.toString(16).padStart(l, '0');
  };

  const handleElementClick = function (index: number, offset: number, event: any) {
    setSelectedElement({index, offset, value: event.target.innerText});
  }

  for (let offset = 0; offset < props.data.length; offset += bytesPerLine) {
    const slice = [...props.data.slice(offset, offset + bytesPerLine)];
    const bytes = slice.map((byte, i) => {
      return <span
        className={`${styles.byteUnit} ${selectedElement.index === i && selectedElement.offset === offset ? styles.selected : ''}`}
        key={offset + i}
        onClick={(e) => handleElementClick(i, offset, e)}>{toHex(byte, 2)}</span>
    });

    const offsetComponent = <span
      className={styles.offsetLine}>{toHex(offset, 8)}</span>
    const bytesComponent = <div
      className={styles.byteLine}>{bytes.slice(0, 8)} {isMobile ? '' : bytes.slice(8)}</div>;
    const asciiComponent = <div className={styles.asciiLine}>| {
      slice.map((byte, i) => {
        if (typeof byte === "string") {
          return <span
            key={offset + i}
            className={`${selectedElement.index === i && selectedElement.offset === offset ? styles.selected : ''}`}
            onClick={(e) => handleElementClick(i, offset, e)}>{byte}</span>;
        }
        if (byte >= 0x20 && byte < 0x7f) {
          return <span
            key={offset + i}
            className={`${selectedElement.index === i && selectedElement.offset === offset ? styles.selected : ''}`}
            onClick={(e) => handleElementClick(i, offset, e)}>{String.fromCharCode(byte)}</span>;
        }
        return <span
          key={offset + i}
          className={`${selectedElement.index === i && selectedElement.offset === offset ? styles.selected : ''}`}
          onClick={(e) => handleElementClick(i, offset, e)}>.</span>;
      })
    } |</div>

    lines.push(<div
      key={offset}
      className={styles.viewerLine}>{offsetComponent} {bytesComponent} {asciiComponent}</div>)
  }

  return (
    <pre style={{
      display: 'flex',
      flexWrap: 'wrap',
      overflowWrap: 'break-word',
      whiteSpace: 'pre-wrap',
      wordBreak: 'break-all'
    }}>
      <span style={{width: '100%'}}>Here comes the HexViewer</span>
      <div className={styles.viewerBody}>{lines}</div>
    <div style={{
      display: 'flex',
      width: '100%',
      marginTop: '20px',
      justifyContent: isMobile ? 'center' : 'flex-start',
    }}>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: '20px',
        marginRight: '20px',
      }}>
        <span>Copy selected to clipboard</span>
        <button style={{
          marginTop: '10px',
          width: '100px',
          padding: '10px'
        }} onClick={() => {
          navigator.clipboard.writeText(selectedElement.value.toString())
        }}>Copy</button>
      </div>
    </div>
    </pre>
  );
}

