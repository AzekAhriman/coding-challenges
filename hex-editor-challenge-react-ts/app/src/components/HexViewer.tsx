import React, {CSSProperties, useEffect, useState} from 'react';

interface HexViewerProps {
  data: string | Uint8Array;
}

const ViewerBody: CSSProperties = {
  marginTop: "10px",
  padding: "10px",
  border: "1px solid black",
  borderRadius: "20px"
}

const ViewerLine: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr 4fr 2fr",
  marginTop: "20px",
  paddingBottom: "5px",
  borderBottom: "1px solid black"
}

const byteUnit: CSSProperties = {
  marginRight: "5px",
  whiteSpace: 'nowrap'
}

const offsetLine: CSSProperties = {
  marginRight: "20px",
  whiteSpace: 'nowrap'
}

const byteLine: CSSProperties = {
  whiteSpace: 'nowrap'
}

const asciiLine: CSSProperties = {
  marginLeft: "20px",
  whiteSpace: 'nowrap'
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
    return () => {
      window.removeEventListener('resize', resizeListener);
    }
  }, [])

  return width;
}

export default function HexViewer(props: HexViewerProps) {
  const lines: React.ReactElement[] = [];
  const isMobile = useCurrentWidth() < 578;
  const BYTES_PER_LINE = isMobile ? 8 : 16;
  const toHex = (n: string | number, l: number) => {
    let result = typeof n === "string" ? Number(n.charCodeAt(0)).toString(16) : n.toString(16).padStart(l, '0');
    return result.length === 1 ? '0' + result : result;
  };

  for (let offset = 0; offset < props.data.length; offset += BYTES_PER_LINE) {
    const slice = [...props.data.slice(offset, offset + BYTES_PER_LINE)];
    const bytes = slice.map((byte, i) => {
      return <span style={byteUnit} key={offset + i}>{toHex(byte, 2)}</span>
    });
    const offsetComponent = <span style={offsetLine}>{toHex(offset, 8)}</span>
    const bytesComponent = <div
      style={byteLine}>{bytes.slice(0, 7)} {isMobile ? '' : bytes.slice(7)}</div>;
    const asciiComponent = <span style={asciiLine}>| {
      slice.map(byte => {
        if (typeof byte === "string") {
          return byte;
        }
        if (byte >= 0x20 && byte < 0x7f) {
          return String.fromCharCode(byte);
        }
        return '.';
      })
    } |</span>

    lines.push(<div
      style={ViewerLine}>{offsetComponent} {bytesComponent} {asciiComponent}</div>)
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
      <div style={ViewerBody}>{lines}</div>
    </pre>
  );
}
