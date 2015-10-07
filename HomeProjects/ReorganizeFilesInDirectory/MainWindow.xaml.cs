using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Navigation;
using System.Windows.Shapes;

namespace ReorganizeFilesInDirectory
{
    /// <summary>
    /// Interaction logic for MainWindow.xaml
    /// </summary>
    public partial class MainWindow : Window
    {
        public ObservableCollection<ReorganizeAction> reorganizeAction = new ObservableCollection<ReorganizeAction>();
        public MainWindow()
        {
            DataContext = this;
            reorganizeAction = new ObservableCollection<ReorganizeAction>();
            reorganizeAction.Add(new ReorganizeAction { Key = "Photos", Value = "Réorganize Photos" });
            reorganizeAction.Add(new ReorganizeAction { Key = "Mp3", Value = "Réorganize Mp3" });
            InitializeComponent();
        }
    }
    public class ReorganizeAction
    {
        public string Key { get; set; }
        public string Value { get; set; }
    }
}
